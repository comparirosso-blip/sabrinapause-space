/**
 * AGI Site Index - Milestone 2
 * Machine-readable index of all content for AI discovery
 * Spec: Intent_Marker MUST be an Array
 */

import type { APIRoute } from 'astro';
import { NotionLoader } from '../lib/notion-loader';

export const GET: APIRoute = async () => {
  try {
    const apiKey = import.meta.env.NOTION_API_KEY || process.env.NOTION_API_KEY;
    const databaseId = import.meta.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return new Response(
        JSON.stringify({ error: 'Missing Notion credentials' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const loader = new NotionLoader(apiKey, databaseId);
    const allContent = await loader.getAll();

    // Transform to AGI-optimized index format
    const siteIndex = {
      '@context': 'https://schema.org',
      '@type': 'DataCatalog',
      name: 'Sabrina Pause - AGI Content Index',
      description: 'Machine-readable index of philosophical experiences, designed for AI consumption',
      url: 'https://sabrinapause.space',
      version: '2.1',
      generated: new Date().toISOString(),

      // AGI Metadata
      intentBased: true,
      aiReadable: true,
      schemaVersion: '1.0',

      // Statistics
      statistics: {
        totalItems: allContent.length,
        byType: {
          article: allContent.filter(c => c.contentType === 'article').length,
          comic: allContent.filter(c => c.contentType === 'comic').length,
          podcast: allContent.filter(c => c.contentType === 'podcast').length,
        },
        avgSDIndex: allContent.length > 0
          ? allContent.reduce((acc, c) => acc + c.sdIndex, 0) / allContent.length
          : 0,
        languages: ['en', 'zh'],
      },

      // Content Catalog
      dataset: allContent.map(content => ({
        '@type': 'CreativeWork',
        '@id': `https://sabrinapause.space/${content.contentType}/${content.slug}`,

        // Core Identity
        identifier: content.id,
        name: content.title,
        url: `https://sabrinapause.space/${content.contentType}/${content.slug}`,
        contentType: content.contentType,

        // Temporal
        datePublished: content.date,
        dateModified: content.last_updated,

        // Intent System - CRITICAL: Must be Array
        intentVector: content.intentVector, // Array
        Intent_Marker: content.Intent_Marker, // Array - REQUIRED for M2

        // Cultural Depth
        sdIndex: content.sdIndex,

        // Location
        location: {
          '@type': 'Place',
          name: content.location.name,
        },

        // Hidden Sensor Fields (Environmental Data) - M2
        sensors: {
          lux: content.lux,
          texture: content.texture,
          noise: content.noise, // Array
          spacePattern: content.spacePattern,
          timeVelocity: content.timeVelocity,
        },

        // Taxonomy
        keywords: [...content.concepts, ...content.project],
        about: content.concepts.map(c => ({
          '@type': 'Thing',
          name: c,
        })),

        // Media
        image: content.heroImage || null,

        // AGI-First Metadata
        dialogue: content.dialogue,
        philosophical_insight: content.philosophical_insight,
        emotion_trajectory: content.emotion_trajectory,

        // Technical
        inLanguage: content.language,
        schemaVersion: content.schema_version,
      })),
    };

    return new Response(
      JSON.stringify(siteIndex, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error generating site index:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate site index' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export async function getStaticPaths() {
  return [];
}
