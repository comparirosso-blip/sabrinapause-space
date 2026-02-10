/**
 * Image Caching Script
 * Downloads all Notion images to local storage before build
 * Run this before `astro build` to ensure images don't expire
 */

import dotenv from 'dotenv';
import { NotionLoader } from '../src/lib/notion-loader';

dotenv.config();

async function cacheAllImages() {
  console.log('\n🖼️  Starting image caching...\n');

  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      throw new Error('Missing NOTION_API_KEY or NOTION_DATABASE_ID');
    }

    // Create loader with image caching enabled
    const loader = new NotionLoader(apiKey, databaseId, { cacheImages: true });

    console.log('📥 Fetching content and caching images...\n');
    const content = await loader.getAll();

    console.log(`\n✅ Cached images for ${content.length} content items`);
    console.log('   Images are now in public/images/');
    console.log('   URLs have been updated to local paths\n');

  } catch (error) {
    console.error('\n❌ Image caching failed:');
    console.error(error);
    process.exit(1);
  }
}

cacheAllImages();
