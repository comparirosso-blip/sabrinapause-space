import type { NotionPage, NotionBlock, BaseContent, ArticleContent, ComicContent, PodcastContent, Content } from '../types';
import { getSDIndex } from './sd-calculator';
import { extractRichText, extractTitleText } from './utils';

/**
 * Extract multi-select values
 */
const extractMultiSelect = (prop: any): string[] =>
  prop?.multi_select?.map((m: any) => m.name) || [];

/**
 * Extract select OR multi-select (handles both per M2 spec: Noise can be either)
 */
const extractSelectOrMulti = (prop: any): string[] => {
  const multi = extractMultiSelect(prop);
  if (multi.length > 0) return multi;
  const single = prop?.select?.name;
  return single ? [single] : [];
};

/**
 * Extract select value
 */
const extractSelect = (prop: any): string =>
  prop?.select?.name || '';

/**
 * Extract date value (ISO 8601 format: YYYY-MM-DD)
 */
const extractDate = (prop: any): string =>
  prop?.date?.start?.split('T')[0] || '';

/**
 * Extract number value
 */
const extractNumber = (prop: any): number =>
  prop?.number ?? 0;

/**
 * Extract file URL from files property
 */
function extractFileUrl(prop: any): string | undefined {
  const file = prop?.files?.[0];
  if (!file) return undefined;
  return file.type === 'external' ? file.external.url : file.file.url;
}

/**
 * Transform Notion page to BaseContent
 */
export function transformToBaseContent(page: NotionPage, blocks: NotionBlock[]): BaseContent {
  const props = page.properties;

  // Extract required fields
  const title = extractTitleText(props.Title || props.Name);
  const slug = extractRichText(props.Slug?.rich_text, { plain: true });
  const contentType = extractSelect(props['Content Type']) as 'article' | 'comic' | 'podcast';
  const date = extractDate(props.Date);
  const locationName = extractRichText(props.Location?.rich_text, { plain: true });
  const webCategory = extractSelect(props['Web Category']);
  const project = extractMultiSelect(props.Project);
  const concepts = extractMultiSelect(props.Concepts);
  const intentVector = extractMultiSelect(props['Intent Vector']);
  const Intent_Marker = extractMultiSelect(props['Intent_Marker']);
  const heroImage = extractFileUrl(props['Hero Image']);

  // Extract Hidden Sensor Fields
  const lux = props.Lux ? extractNumber(props.Lux) : null;
  const texture = props.Texture ? extractSelect(props.Texture) : null;
  const noise = extractSelectOrMulti(props.Noise);
  const spacePattern = extractRichText(props['Space Pattern']?.rich_text, { plain: true }) || null;
  const timeVelocity = props['Time Velocity'] ? extractNumber(props['Time Velocity']) : null;

  // SD-Index™
  const notionSDIndex = extractNumber(props['SD-Index™'] || props['SD-Index']);
  const sdIndex = getSDIndex(notionSDIndex, { lux, texture, noise });

  // Infer language (default to 'en' for now, can be enhanced)
  const language: 'zh' | 'en' = 'en';

  return {
    id: page.id,
    contentType,
    title,
    date,
    slug,
    location: {
      name: locationName,
    },
    webCategory,
    project,
    concepts,
    intentVector,
    sdIndex,
    Intent_Marker,
    // Hidden Sensor Fields (Milestone 2)
    lux,
    texture,
    noise,
    spacePattern,
    timeVelocity,
    heroImage,
    blocks,
    // AGI-First Metadata (v2.1) - Always include with defaults for consistent schema
    dialogue: [], // Array of speaker/text objects for conversations
    philosophical_insight: {}, // Metaphor and reflection fields
    emotion_trajectory: {}, // Start and end emotional states
    embedding: null, // Reserved for vector embeddings
    // Metadata
    schema_version: '1.0',
    last_updated: new Date().toISOString(),
    language,
  };
}

/**
 * Transform to ArticleContent
 */
export function transformToArticleContent(base: BaseContent, blocks: NotionBlock[]): ArticleContent {
  // Extract excerpt from first paragraph block
  let excerpt = '';
  const firstParagraph = blocks.find(b => b.type === 'paragraph');
  if (firstParagraph && firstParagraph.paragraph) {
    const text = firstParagraph.paragraph.rich_text
      ?.map((item: any) => item.plain_text || '')
      .join('') || '';
    excerpt = text.substring(0, 200);
  }

  // Calculate reading time (average 200 words per minute)
  const wordCount = blocks
    .filter(b => b.type === 'paragraph')
    .reduce((count, block) => {
      const text = block.paragraph?.rich_text
        ?.map((item: any) => item.plain_text || '')
        .join('') || '';
      return count + text.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 225)); // 225 wpm is a better standard for hybrid content

  return {
    ...base,
    contentType: 'article',
    excerpt,
    readingTime,
  };
}

/**
 * Transform to ComicContent
 */
export function transformToComicContent(base: BaseContent, blocks: NotionBlock[]): ComicContent {
  // Extract panels from image blocks
  const panels: ComicContent['panels'] = [];
  let panelNumber = 1;

  blocks.forEach((block, index) => {
    if (block.type === 'image') {
      const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
      const caption = block.image?.caption
        ?.map((item: any) => item.plain_text || '')
        .join('') || '';

      // Get narration from next paragraph block
      let narration: string | undefined;
      if (index < blocks.length - 1 && blocks[index + 1].type === 'paragraph') {
        narration = blocks[index + 1].paragraph?.rich_text
          ?.map((item: any) => item.plain_text || '')
          .join('');
      }

      panels.push({
        panelNumber: panelNumber++,
        imageUrl,
        width: 800,
        height: 600, // Default, should be extracted from image metadata if available
        altText: caption,
        narration,
      });
    }
  });

  // Extract episode number from title if available (e.g., "EP1: ...")
  const titleMatch = base.title.match(/EP(?:isode)?\s*(\d+)/i);
  const episodeNumber = titleMatch ? parseInt(titleMatch[1], 10) : 1;

  // Extract sensory memory from callout blocks
  let sensoryMemory: ComicContent['sensoryMemory'] | undefined;
  const sensoryCallout = blocks.find(b => b.type === 'callout' && extractRichText(b.callout?.rich_text).toLowerCase().includes('sensory'));

  if (sensoryCallout) {
    // Basic sensory extraction placeholder
    sensoryMemory = {
      sight: ['Visual resonance'],
      scent: [],
      taste: [],
      touch: [],
      sound: []
    };
  }

  return {
    ...base,
    contentType: 'comic',
    episodeNumber,
    panels,
    sensoryMemory,
  };
}

/**
 * Transform to PodcastContent
 */
export function transformToPodcastContent(base: BaseContent, blocks: NotionBlock[]): PodcastContent {
  // Extract all audio blocks (M2 refinement)
  const audioBlocks = blocks.filter(b => b.type === 'file' || b.type === 'video' || b.type === 'audio');
  const audioFiles = audioBlocks.map(block => {
    const url = block.audio?.file?.url || block.audio?.external?.url ||
      block.file?.file?.url || block.video?.file?.url || '';

    // Extract title from caption if available
    const caption = block.audio?.caption || block.file?.caption || block.video?.caption || [];
    const title = caption.length > 0 ? extractRichText(caption) : '';

    return {
      url,
      duration: '0:00', // Still placeholder, actual duration handled client-side
      title: title || undefined
    };
  }).filter(f => f.url);

  // Extract transcript from all text blocks
  const transcript = blocks
    .filter(b => ['paragraph', 'heading_1', 'heading_2', 'heading_3'].includes(b.type))
    .map(block => {
      if (block.type.startsWith('heading_')) {
        const level = block.type.split('_')[1];
        const text = block[`heading_${level}`]?.rich_text
          ?.map((item: any) => item.plain_text || '')
          .join('') || '';
        return `\n## ${text}\n`;
      }
      return block.paragraph?.rich_text
        ?.map((item: any) => item.plain_text || '')
        .join('') || '';
    })
    .join('\n');

  // Extract structure from headings (simplified)
  const structure: PodcastContent['structure'] = {
    intro: { timestamp: '0:00', summary: '' },
    mainContent: { timestamp: '0:00', topics: [] },
    outro: { timestamp: '0:00', summary: '' },
  };

  return {
    ...base,
    contentType: 'podcast',
    audioFiles,
    structure,
    transcript,
  };
}

/**
 * Main transformation function - transforms Notion page to Content
 */
export function transformNotionPageToContent(page: NotionPage, blocks: NotionBlock[]): Content {
  const base = transformToBaseContent(page, blocks);

  switch (base.contentType) {
    case 'article':
      return transformToArticleContent(base, blocks);
    case 'comic':
      return transformToComicContent(base, blocks);
    case 'podcast':
      return transformToPodcastContent(base, blocks);
    default:
      // Fallback to article if content type is unknown
      return transformToArticleContent(base, blocks);
  }
}
