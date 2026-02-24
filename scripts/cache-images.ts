/**
 * Image Caching Script
 * Downloads all Notion images to local storage before build
 * Run this before `astro build` to ensure images don't expire
 */

import dotenv from 'dotenv';
import { NotionLoader } from '../src/lib/notion-loader';

dotenv.config();

async function cacheAllImages() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      throw new Error('Missing NOTION_API_KEY or NOTION_DATABASE_ID');
    }

    const loader = new NotionLoader(apiKey, databaseId, { cacheImages: true });
    await loader.getAll();
  } catch {
    process.exit(1);
  }
}

cacheAllImages();
