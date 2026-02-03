/**
 * Block Rendering Pipeline
 * Converts Notion blocks to HTML for testing and rendering
 * This is a basic implementation for Milestone 1 - will be enhanced in Milestone 2
 */

import type { NotionBlock } from '../types';

/**
 * Extract text from rich text array
 */
function extractRichText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(item => item.plain_text || '').join('');
}

/**
 * Render a single Notion block to HTML
 */
export function renderBlock(block: NotionBlock): string {
  switch (block.type) {
    case 'paragraph':
      const paragraphText = extractRichText(block.paragraph?.rich_text || []);
      return `<p class="prose">${paragraphText}</p>`;

    case 'heading_1':
      const h1Text = extractRichText(block.heading_1?.rich_text || []);
      return `<h1 class="text-4xl font-bold mb-4">${h1Text}</h1>`;

    case 'heading_2':
      const h2Text = extractRichText(block.heading_2?.rich_text || []);
      return `<h2 class="text-3xl font-bold mb-3">${h2Text}</h2>`;

    case 'heading_3':
      const h3Text = extractRichText(block.heading_3?.rich_text || []);
      return `<h3 class="text-2xl font-bold mb-2">${h3Text}</h3>`;

    case 'bulleted_list_item':
      const bulletText = extractRichText(block.bulleted_list_item?.rich_text || []);
      return `<li class="list-disc ml-6">${bulletText}</li>`;

    case 'numbered_list_item':
      const numberedText = extractRichText(block.numbered_list_item?.rich_text || []);
      return `<li class="list-decimal ml-6">${numberedText}</li>`;

    case 'quote':
      const quoteText = extractRichText(block.quote?.rich_text || []);
      return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">${quoteText}</blockquote>`;

    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
      const caption = extractRichText(block.image?.caption || []);
      return `<img src="${imageUrl}" alt="${caption}" class="w-full" loading="lazy" />`;

    case 'callout':
      const calloutText = extractRichText(block.callout?.rich_text || []);
      const icon = block.callout?.icon?.emoji || '💡';
      return `<div class="callout bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <span class="text-xl mr-2">${icon}</span>
        <span>${calloutText}</span>
      </div>`;

    case 'divider':
      return `<hr class="my-8 border-gray-300" />`;

    case 'code':
      const codeText = extractRichText(block.code?.rich_text || []);
      const language = block.code?.language || '';
      return `<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code class="language-${language}">${codeText}</code></pre>`;

    default:
      // For unsupported block types, return a comment
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
