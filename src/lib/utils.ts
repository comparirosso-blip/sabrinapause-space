/**
 * Shared utility functions for content transformation and rendering
 */

/**
 * Extract rich text from Notion rich_text arrays with optional formatting
 */
export function extractRichText(richText: any[] | null | undefined, options: { plain?: boolean } = {}): string {
    if (!richText || !Array.isArray(richText)) return '';

    return richText.map(item => {
        let text = item.plain_text || '';

        if (options.plain) return text;

        // Apply text formatting for HTML output
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
export function escapeHtml(text: string): string {
    // Check if we are in a browser environment
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Server-side fallback
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Extract simple title from Notion title/name property
 */
export function extractTitleText(property: any): string {
    if (!property) return '';
    const titleArray = property.title || property.name || [];
    return extractRichText(titleArray, { plain: true });
}
