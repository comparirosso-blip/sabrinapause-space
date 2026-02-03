/**
 * ContentLoader interface - abstraction layer for content fetching
 * Allows future migration to other CMSs without rewriting page templates
 */

import type { Content } from '../types';

export interface ContentLoader {
  /**
   * Get all content, optionally filtered by content type
   */
  getAll(contentType?: 'article' | 'comic' | 'podcast'): Promise<Content[]>;
  
  /**
   * Get a single content item by slug
   */
  getBySlug(slug: string): Promise<Content | null>;
  
  /**
   * Get all content items within a specific project
   */
  getByProject(projectSlug: string): Promise<Content[]>;
  
  /**
   * Get all content items in a specific web category
   */
  getByCategory(category: string): Promise<Content[]>;
}
