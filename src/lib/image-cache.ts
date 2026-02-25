/**
 * Image Caching System
 * Downloads Notion images during build, optimizes for fast loading, replaces temp S3 URLs with permanent local paths
 *
 * Optimizations:
 * - Resize to max 2560px (retina-ready)
 * - WebP 90% (visually lossless, 30-50% smaller)
 * - Dimensions stored to prevent layout shift (CLS)
 *
 * Non-images (audio, video): stored as-is
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp)$/i;
const MAX_DIMENSION = 2560;
const WEBP_QUALITY = 90;

export type CacheResult = {
  url: string;
  width?: number;
  height?: number;
};

export class ImageCache {
  private cacheDir: string;
  private publicDir: string;
  private imageMap: Map<string, CacheResult>;

  constructor() {
    this.publicDir = path.join(process.cwd(), 'public', 'images');
    this.cacheDir = this.publicDir;
    this.imageMap = new Map();

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private generateFilename(url: string, stableId?: string, ext: string = '.jpg'): string {
    const name = stableId || crypto.createHash('md5').update(url).digest('hex');

    if (ext !== '.jpg') {
      return `${name}${ext}`;
    }

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|m4a|mp3)$/i);
      if (match) {
        return `${name}${match[0].toLowerCase()}`;
      }
    } catch {
      // Invalid URL, use default
    }

    return `${name}${ext}`;
  }

  private isImageFile(filename: string): boolean {
    return IMAGE_EXT.test(filename);
  }

  private async downloadToBuffer(url: string, retries = 3): Promise<ArrayBuffer | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; sabrinapause/1.0)',
            'Accept': 'image/*',
          },
        });
        if (!response.ok) {
          if (i === retries - 1) return null;
          continue;
        }
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength === 0) {
          if (i === retries - 1) return null;
          continue;
        }
        return buffer;
      } catch {
        if (i === retries - 1) return null;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return null;
  }

  private async optimizeImage(buffer: Buffer, filepath: string): Promise<{ width: number; height: number } | null> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      let { width = 0, height = 0 } = metadata;

      if (!width || !height) {
        const dims = await image.metadata();
        width = dims.width || 0;
        height = dims.height || 0;
      }

      if (width === 0 || height === 0) return null;

      const needsResize = width > MAX_DIMENSION || height > MAX_DIMENSION;
      let pipeline = image;

      if (needsResize) {
        pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      await pipeline
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(filepath);

      const outputMeta = await sharp(filepath).metadata();
      return {
        width: outputMeta.width || width,
        height: outputMeta.height || height,
      };
    } catch {
      return null;
    }
  }

  /**
   * Cache a single image/file. Returns URL and dimensions (for images only).
   */
  async cacheImage(url: string, stableId?: string): Promise<CacheResult | null> {
    if (!url || url === '') return null;

    if (this.imageMap.has(url)) {
      return this.imageMap.get(url)!;
    }

    if (url.startsWith('/images/')) {
      return { url };
    }

    const rawFilename = this.generateFilename(url, stableId);
    const isImage = this.isImageFile(rawFilename);
    const outputFilename = isImage
      ? rawFilename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.webp')
      : rawFilename;
    const filepath = path.join(this.cacheDir, outputFilename);
    const publicPath = `/images/${outputFilename}`;

    if (fs.existsSync(filepath)) {
      let dims: { width?: number; height?: number } = {};
      if (isImage) {
        try {
          const meta = await sharp(filepath).metadata();
          dims = { width: meta.width, height: meta.height };
        } catch {
          // Use defaults if we can't read
        }
      }
      const result: CacheResult = { url: publicPath, ...dims };
      this.imageMap.set(url, result);
      return result;
    }

    const buffer = await this.downloadToBuffer(url);
    if (!buffer) return null;

    if (isImage) {
      const dims = await this.optimizeImage(Buffer.from(buffer), filepath);
      if (dims) {
        const result: CacheResult = { url: publicPath, width: dims.width, height: dims.height };
        this.imageMap.set(url, result);
        return result;
      }
      return null;
    }

    fs.writeFileSync(filepath, Buffer.from(buffer));
    const result: CacheResult = { url: publicPath };
    this.imageMap.set(url, result);
    return result;
  }

  async cacheHeroImage(url: string | undefined): Promise<CacheResult | undefined> {
    if (!url) return undefined;
    const result = await this.cacheImage(url);
    return result || undefined;
  }

  async cacheBlockImages(blocks: any[]): Promise<any[]> {
    const updatedBlocks = [];

    for (const block of blocks) {
      const updatedBlock = { ...block };

      const mediaTypes = ['image', 'audio', 'video', 'file'];
      if (mediaTypes.includes(block.type)) {
        const media = block[block.type];
        const url = media?.file?.url || media?.external?.url;

        if (url) {
          const result = await this.cacheImage(url, block.id);
          if (result) {
            updatedBlock[block.type] = {
              ...media,
              type: 'file',
              file: {
                url: result.url,
                ...(result.width && result.height && { width: result.width, height: result.height }),
              },
            };
          } else {
            // Cache failed — never pass through Notion URLs (they expire). Remove to avoid AccessDenied.
            updatedBlock[block.type] = { ...media, type: 'file', file: { url: undefined } };
          }
        }
      }

      if (block.has_children && block[block.type]?.children) {
        updatedBlock[block.type] = {
          ...block[block.type],
          children: await this.cacheBlockImages(block[block.type].children),
        };
      }

      updatedBlocks.push(updatedBlock);
    }

    return updatedBlocks;
  }

  getStats(): { total: number; cached: number } {
    return {
      total: this.imageMap.size,
      cached: this.imageMap.size,
    };
  }
}
