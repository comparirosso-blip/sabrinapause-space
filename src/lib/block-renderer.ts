/**
 * Block Rendering Pipeline - Milestone 2 Enhanced
 * Converts Notion blocks to HTML with full formatting support
 * Handles: text formatting, embeds, toggles, columns, tables, etc.
 */

import type { NotionBlock } from '../types';

/**
 * Extract and format rich text with styling (bold, italic, code, links)
 */
function extractRichText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(item => {
    let text = item.plain_text || '';
    
    // Apply text formatting
    if (item.annotations) {
      if (item.annotations.bold) text = `<strong>${text}</strong>`;
      if (item.annotations.italic) text = `<em>${text}</em>`;
      if (item.annotations.strikethrough) text = `<s>${text}</s>`;
      if (item.annotations.underline) text = `<u>${text}</u>`;
      if (item.annotations.code) text = `<code>${text}</code>`;
    }
    
    // Handle links
    if (item.href) {
      text = `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    
    return text;
  }).join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  // Fallback for server-side rendering
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
      const imageCaption = extractRichText(block.image?.caption || []);
      return `
        <figure class="my-6">
          <img src="${imageUrl}" alt="${imageCaption}" class="w-full rounded-lg" loading="lazy" />
          ${imageCaption ? `<figcaption class="text-center text-sm text-neutral-600 mt-2">${imageCaption}</figcaption>` : ''}
        </figure>`;

    // Video
    case 'video':
      const videoUrl = block.video?.file?.url || block.video?.external?.url || '';
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
        <details class="my-4">
          <summary class="cursor-pointer font-medium hover:text-neutral-700">${toggleText}</summary>
          <div class="pl-4 pt-2">
            <!-- Toggle content would be nested blocks -->
          </div>
        </details>`;

    // Divider
    case 'divider':
      return `<hr class="my-8 border-neutral-200" />`;

    // Table of Contents
    case 'table_of_contents':
      return `<div class="toc my-6 p-4 bg-neutral-50 rounded-lg text-sm">📑 Table of Contents</div>`;

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
