import type { NotionBlock } from '../types';
import { extractRichText, escapeHtml } from './utils';

/**
 * Render a single Notion block to HTML - Enhanced for M2
 */
export function renderBlock(block: NotionBlock): string {
  switch (block.type) {
    // Text Blocks
    case 'paragraph':
      const paragraphText = extractRichText(block.paragraph?.rich_text || []);
      return paragraphText ? `<p>${paragraphText}</p>` : '<p><br /></p>';

    // Headings
    case 'heading_1':
      const h1Text = extractRichText(block.heading_1?.rich_text || []);
      return `<h1>${h1Text}</h1>`;

    case 'heading_2':
      const h2Text = extractRichText(block.heading_2?.rich_text || []);
      return `<h2>${h2Text}</h2>`;

    case 'heading_3':
      const h3Text = extractRichText(block.heading_3?.rich_text || []);
      return `<h3>${h3Text}</h3>`;

    // Lists
    case 'bulleted_list_item':
      const bulletText = extractRichText(block.bulleted_list_item?.rich_text || []);
      return `<li>${bulletText}</li>`;

    case 'numbered_list_item':
      const numberedText = extractRichText(block.numbered_list_item?.rich_text || []);
      return `<li>${numberedText}</li>`;

    case 'to_do':
      const todoText = extractRichText(block.to_do?.rich_text || []);
      const checked = block.to_do?.checked ? 'checked' : '';
      return `
        <div class="flex items-start gap-2 my-2">
          <input type="checkbox" ${checked} disabled class="mt-1" />
          <span class="${checked ? 'line-through text-neutral-500' : ''}">${todoText}</span>
        </div>`;

    // Quote
    case 'quote':
      const quoteText = extractRichText(block.quote?.rich_text || []);
      return `<blockquote>${quoteText}</blockquote>`;

    // Callout
    case 'callout':
      const calloutText = extractRichText(block.callout?.rich_text || []);
      const icon = block.callout?.icon?.emoji || '💡';
      return `
        <div class="callout flex gap-3 p-4 my-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <span class="text-2xl flex-shrink-0">${icon}</span>
          <div class="flex-1">${calloutText}</div>
        </div>`;

    // Code Block
    case 'code':
      const codeText = extractRichText(block.code?.rich_text || []);
      const language = block.code?.language || 'plaintext';
      return `
        <pre class="code-block"><code class="language-${language}">${escapeHtml(codeText)}</code></pre>`;

    // Image
    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
      if (!imageUrl || !imageUrl.startsWith('/')) return ''; // Skip: no URL or Notion URL (expires)
      const imageCaption = extractRichText(block.image?.caption || []);
      const imgW = block.image?.file?.width;
      const imgH = block.image?.file?.height;
      const imgAttrs = imgW && imgH
        ? `width="${imgW}" height="${imgH}" `
        : '';
      return `
        <figure class="my-6">
          <img src="${imageUrl}" alt="${imageCaption}" ${imgAttrs}class="w-full h-auto rounded-lg" loading="lazy" decoding="async" />
          ${imageCaption ? `<figcaption class="text-center text-sm text-neutral-600 mt-2">${imageCaption}</figcaption>` : ''}
        </figure>`;

    case 'audio':
      const audioUrl = block.audio?.file?.url || block.audio?.external?.url;
      if (!audioUrl || !audioUrl.startsWith('/')) return '<!-- Audio skipped: no local URL -->';
      return `
        <div class="my-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
          <p class="text-sm font-medium text-neutral-500 mb-3 flex items-center gap-2">
            <span>🎙️ Audio Clip</span>
            ${block.audio.caption?.length ? `<span class="text-neutral-300">|</span> <span>${extractRichText(block.audio.caption)}</span>` : ''}
          </p>
          <audio controls class="w-full">
            <source src="${audioUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      `;
    case 'video':
      const videoUrl = block.video?.file?.url || block.video?.external?.url || '';
      if (!videoUrl || !videoUrl.startsWith('/')) return '<!-- Video skipped: no local URL -->';
      return `
        <div class="video-container my-6">
          <video controls class="w-full rounded-lg">
            <source src="${videoUrl}" />
            Your browser does not support the video tag.
          </video>
        </div>`;

    // File
    case 'file':
      const fileUrl = block.file?.file?.url || block.file?.external?.url || '';
      if (!fileUrl || !fileUrl.startsWith('/')) return '<!-- File skipped: no local URL -->';
      const fileName = block.file?.name || 'Download file';
      return `
        <a href="${fileUrl}" download class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors my-4">
          📎 ${fileName}
        </a>`;

    // Embed
    case 'embed':
      const embedUrl = block.embed?.url || '';
      return `
        <div class="embed-container my-6">
          <iframe src="${embedUrl}" class="w-full h-96 rounded-lg border border-neutral-200" frameborder="0" allowfullscreen></iframe>
        </div>`;

    // Bookmark
    case 'bookmark':
      const bookmarkUrl = block.bookmark?.url || '';
      const bookmarkCaption = extractRichText(block.bookmark?.caption || []);
      return `
        <a href="${bookmarkUrl}" target="_blank" rel="noopener noreferrer" class="block my-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
          <div class="text-sm text-neutral-600">🔗 ${bookmarkCaption || bookmarkUrl}</div>
        </a>`;

    // Toggle
    case 'toggle':
      const toggleText = extractRichText(block.toggle?.rich_text || []);
      return `
        <details class="my-4 group border border-neutral-100 rounded-lg overflow-hidden transition-all duration-300">
          <summary class="cursor-pointer font-medium p-4 bg-neutral-50/50 hover:bg-neutral-50 flex items-center gap-2 list-none marker:hidden">
            <span class="group-open:rotate-90 transition-transform duration-200">▶</span>
            ${toggleText}
          </summary>
          <div class="p-4 border-t border-neutral-100 bg-white">
            ${block.has_children ? '<!-- Children rendered via nested logic -->' : '<p class="text-sm text-neutral-400">No content</p>'}
          </div>
        </details>`;

    // Divider
    case 'divider':
      return `<hr class="my-12 border-neutral-100" />`;

    // Table of Contents
    case 'table_of_contents':
      return `
        <nav class="toc my-8 p-6 bg-neutral-50 font-outfit rounded-xl border border-neutral-200">
          <div class="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-4">Jump to Section</div>
          <div id="toc-placeholder" class="text-sm text-neutral-500 italic">Exploring content structure...</div>
        </nav>`;

    // Breadcrumb
    case 'breadcrumb':
      return `<nav class="breadcrumb text-sm text-neutral-600 my-4">...</nav>`;

    // Unsupported types
    default:
      return `<!-- Unsupported block type: ${block.type} -->`;
  }
}

/**
 * Render all blocks to HTML
 * Handles list wrapping (bulleted_list_item and numbered_list_item need to be wrapped)
 */
export function renderBlocks(blocks: NotionBlock[]): string {
  const html: string[] = [];
  let inBulletList = false;
  let inNumberedList = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const nextBlock = blocks[i + 1];

    // Handle bulleted lists
    if (block.type === 'bulleted_list_item') {
      if (!inBulletList) {
        html.push('<ul class="list-disc ml-6 mb-4">');
        inBulletList = true;
      }
      html.push(renderBlock(block));

      if (nextBlock?.type !== 'bulleted_list_item') {
        html.push('</ul>');
        inBulletList = false;
      }
    }
    // Handle numbered lists
    else if (block.type === 'numbered_list_item') {
      if (!inNumberedList) {
        html.push('<ol class="list-decimal ml-6 mb-4">');
        inNumberedList = true;
      }
      html.push(renderBlock(block));

      if (nextBlock?.type !== 'numbered_list_item') {
        html.push('</ol>');
        inNumberedList = false;
      }
    }
    // Handle other block types
    else {
      html.push(renderBlock(block));
    }
  }

  return html.join('\n');
}

/**
 * Render blocks to plain text (for excerpt generation, etc.)
 */
export function renderBlocksToText(blocks: NotionBlock[]): string {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'paragraph':
          return extractRichText(block.paragraph?.rich_text || []);
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
          return extractRichText(block[block.type]?.rich_text || []);
        case 'bulleted_list_item':
        case 'numbered_list_item':
          return extractRichText(block[block.type]?.rich_text || []);
        case 'quote':
          return extractRichText(block.quote?.rich_text || []);
        default:
          return '';
      }
    })
    .filter(text => text.length > 0)
    .join(' ');
}
