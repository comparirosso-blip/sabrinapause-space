/**
 * GitHub Backup System
 * Saves all Notion content as JSON files for data independence
 */

import fs from 'fs';
import path from 'path';
import type { Content } from '../types';

export class BackupSystem {
  private backupDir: string;
  private baseDir: string;
  private today: string;

  constructor(baseDir: string = 'data/backup') {
    this.baseDir = path.join(process.cwd(), baseDir);
    this.today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.backupDir = path.join(this.baseDir, this.today);
  }

  /**
   * Check if content has changed since last backup
   */
  private hasContentChanged(content: Content[]): boolean {
    // Get the latest backup directory
    if (!fs.existsSync(this.baseDir)) {
      return true; // No backups exist yet
    }

    const backupDirs = fs.readdirSync(this.baseDir)
      .filter(dir => /^\d{4}-\d{2}-\d{2}$/.test(dir))
      .sort()
      .reverse();

    if (backupDirs.length === 0) {
      return true; // No previous backups
    }

    const latestDir = backupDirs[0];
    const latestBackupPath = path.join(this.baseDir, latestDir, 'all-experiences.json');
    
    if (!fs.existsSync(latestBackupPath)) {
      return true; // Previous backup incomplete
    }

    try {
      const previousBackup = JSON.parse(fs.readFileSync(latestBackupPath, 'utf-8'));
      const previousData = previousBackup.data || [];
      
      // Compare content count and slugs
      const currentSlugs = new Set(content.map(c => c.slug));
      const previousSlugs = new Set(previousData.map((c: any) => c.slug));
      
      if (currentSlugs.size !== previousSlugs.size) {
        return true;
      }
      
      for (const slug of currentSlugs) {
        if (!previousSlugs.has(slug)) {
          return true;
        }
      }
      
      const currentLastUpdated = Math.max(...content.map(c => new Date(c.last_updated).getTime()));
      const previousLastUpdated = Math.max(...previousData.map((c: any) => new Date(c.last_updated).getTime()));
      
      if (currentLastUpdated > previousLastUpdated) {
        return true;
      }
      
      return false;
      
    } catch {
      return true;
    }
  }

  /**
   * Ensure backup directory exists
   */
  private ensureDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Save all content to JSON file
   */
  async saveAllContent(content: Content[]): Promise<string> {
    this.ensureDirectory();

    const filename = 'all-experiences.json';
    const filepath = path.join(this.backupDir, filename);

    const backup = {
      version: '1.0',
      backup_date: new Date().toISOString(),
      count: content.length,
      data: content
    };

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

    return filepath;
  }

  /**
   * Save individual content files (organized by content type)
   */
  async saveIndividualContent(content: Content[]): Promise<string[]> {
    this.ensureDirectory();

    const filepaths: string[] = [];
    const slugCounts: Record<string, number> = {};

    // Group content by type
    const byType = {
      article: content.filter(c => c.contentType === 'article'),
      comic: content.filter(c => c.contentType === 'comic'),
      podcast: content.filter(c => c.contentType === 'podcast'),
    };

    // Save each type in its own folder
    for (const [type, items] of Object.entries(byType)) {
      if (items.length === 0) continue;
      
      const typeDir = path.join(this.backupDir, `${type}s`);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }

      for (const item of items) {
        let filename = `${item.slug}.json`;
        
        // Handle duplicate slugs
        const slugKey = `${type}:${item.slug}`;
        if (slugCounts[slugKey]) {
          slugCounts[slugKey]++;
          filename = `${item.slug}-${slugCounts[slugKey]}.json`;
        } else {
          slugCounts[slugKey] = 1;
        }
        
        const filepath = path.join(typeDir, filename);

        const backup = {
          version: '1.0',
          backup_date: new Date().toISOString(),
          data: item
        };

        fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');
        filepaths.push(filepath);
      }
    }

    return filepaths;
  }

  /**
   * Save metadata summary (Enhanced for AGI)
   */
  async saveMetadata(content: Content[]): Promise<string> {
    this.ensureDirectory();

    const metadata = {
      // Backup Information
      schema_version: '1.0',
      backup_date: new Date().toISOString(),
      backup_source: 'Notion API',
      
      // Content Statistics
      total_count: content.length,
      content_types: {
        article: content.filter(c => c.contentType === 'article').length,
        comic: content.filter(c => c.contentType === 'comic').length,
        podcast: content.filter(c => c.contentType === 'podcast').length
      },
      
      // Taxonomy
      categories: [...new Set(content.map(c => c.webCategory))],
      projects: [...new Set(content.flatMap(c => c.project))],
      all_concepts: [...new Set(content.flatMap(c => c.concepts || []))],
      
      // Timeline
      date_range: {
        earliest: content.reduce((min, c) => c.date < min ? c.date : min, content[0]?.date || ''),
        latest: content.reduce((max, c) => c.date > max ? c.date : max, content[0]?.date || '')
      },
      
      // Content Index (for quick lookup)
      content_index: content.map(c => ({
        slug: c.slug,
        title: c.title,
        type: c.contentType,
        date: c.date,
        sd_index: c.sdIndex
      })),
      
      // AGI Metadata
      agi_ready: {
        with_embeddings: content.filter(c => c.embedding !== null).length,
        with_dialogue: content.filter(c => c.dialogue && c.dialogue.length > 0).length,
        with_philosophical_insight: content.filter(c => c.philosophical_insight && Object.keys(c.philosophical_insight).length > 0).length,
        total_blocks: content.reduce((sum, c) => sum + c.blocks.length, 0)
      }
    };

    const filepath = path.join(this.backupDir, 'metadata.json');
    fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2), 'utf-8');

    return filepath;
  }

  /**
   * Full backup - saves all, individual files, and metadata (only if changes detected)
   */
  async performFullBackup(content: Content[]): Promise<void> {
    if (!this.hasContentChanged(content)) {
      return;
    }

    await this.saveAllContent(content);
    await this.saveIndividualContent(content);
    await this.saveMetadata(content);
  }
}
