/**
 * Image Caching System
 * Downloads Notion images during build and replaces temporary S3 URLs with permanent local paths
 * 
 * Problem: Notion API image URLs expire after ~1 hour
 * Solution: Download all images to /public/images/ and update URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImageCache {
  private cacheDir: string;
  private publicDir: string;
  private imageMap: Map<string, string>; // originalUrl -> localPath

  constructor() {
    // Public directory for serving images
    this.publicDir = path.join(process.cwd(), 'public', 'images');
    this.cacheDir = this.publicDir;
    this.imageMap = new Map();
    
    // Ensure directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Generate a stable filename from URL
   */
  private generateFilename(url: string): string {
    // Create hash of URL for stable filename
    const hash = crypto.createHash('md5').update(url).digest('hex');
    
    // Extract extension from URL or default to .jpg
    let ext = '.jpg';
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      if (match) {
        ext = match[0].toLowerCase();
      }
    } catch (e) {
      // Invalid URL, use default
    }
    
    return `${hash}${ext}`;
  }

  /**
   * Download image from URL
   */
  private async downloadImage(url: string, filepath: string): Promise<boolean> {
    try {
      // Use fetch to download
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`   ❌ Failed to download: ${url} (${response.status})`);
        return false;
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      
      return true;
    } catch (error) {
      console.error(`   ❌ Error downloading ${url}:`, error);
      return false;
    }
  }

  /**
   * Cache a single image
   * Returns the local path (relative to /public)
   */
  async cacheImage(url: string): Promise<string | null> {
    if (!url || url === '') return null;

    // Check if already cached
    if (this.imageMap.has(url)) {
      return this.imageMap.get(url)!;
    }

    // Check if URL is already a local path
    if (url.startsWith('/images/')) {
      return url;
    }

    const filename = this.generateFilename(url);
    const filepath = path.join(this.cacheDir, filename);
    const publicPath = `/images/${filename}`;

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`   ♻️  Cached: ${filename}`);
      this.imageMap.set(url, publicPath);
      return publicPath;
    }

    // Download image
    console.log(`   ⬇️  Downloading: ${url.substring(0, 60)}...`);
    const success = await this.downloadImage(url, filepath);

    if (success) {
      console.log(`   ✅ Saved: ${filename}`);
      this.imageMap.set(url, publicPath);
      return publicPath;
    }

    return null;
  }

  /**
   * Cache hero image and return updated URL
   */
  async cacheHeroImage(url: string | undefined): Promise<string | undefined> {
    if (!url) return undefined;
    const cachedUrl = await this.cacheImage(url);
    return cachedUrl || undefined;
  }

  /**
   * Cache all images in Notion blocks and update URLs
   */
  async cacheBlockImages(blocks: any[]): Promise<any[]> {
    const updatedBlocks = [];

    for (const block of blocks) {
      const updatedBlock = { ...block };

      // Handle image blocks
      if (block.type === 'image') {
        const imageUrl = block.image?.file?.url || block.image?.external?.url;
        if (imageUrl) {
          const cachedUrl = await this.cacheImage(imageUrl);
          if (cachedUrl) {
            updatedBlock.image = {
              ...block.image,
              type: 'file',
              file: { url: cachedUrl }
            };
          }
        }
      }

      updatedBlocks.push(updatedBlock);
    }

    return updatedBlocks;
  }

  /**
   * Get statistics
   */
  getStats(): { total: number; cached: number } {
    return {
      total: this.imageMap.size,
      cached: this.imageMap.size,
    };
  }
}
