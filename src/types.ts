/**
 * Type definitions for Sabrina's Pause content platform
 * Based on Technical Specification v2.0
 */

// Notion API types (simplified)
export type NotionBlock = {
  id: string;
  type: string;
  [key: string]: any;
};

export type NotionPage = {
  id: string;
  properties: {
    [key: string]: any;
  };
  [key: string]: any;
};

// Universal Base Schema
export interface BaseContent {
  // Required Fields
  id: string; // Notion page ID
  contentType: 'article' | 'comic' | 'podcast';
  title: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  slug: string; // From Notion "Slug" property

  // Location Data
  location: {
    name: string; // e.g., "Lake Tanuki, Shizuoka"
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Taxonomy (from Notion properties)
  webCategory: string; // Notion "Web Category"
  project: string[]; // Notion "Project" multi-select
  concepts: string[]; // Notion "Concepts" multi-select

  // Cultural Legacy Markers
  intentVector: string[]; // Notion "Intent Vector" (multi_select in Notion)
  sdIndex: number; // Notion "SD-Index™" (formula type, can be auto-calculated in M2)
  Intent_Marker: string[]; // Notion "Intent_Marker" (multi-select) - REQUIRED for M2

  // Hidden Sensor Fields (Environmental/Sensory Data) - Milestone 2
  lux: number | null; // Light intensity measurement (Notion "Lux")
  texture: string | null; // Tactile/material quality (Notion "Texture" - select)
  noise: string[]; // Ambient sound categories (Notion "Noise" - multi_select)
  spacePattern: string | null; // Spatial configuration (Notion "Space Pattern")
  timeVelocity: number | null; // Temporal flow perception (Notion "Time Velocity")

  // Media
  heroImage?: string; // Notion "Hero Image" file URL

  // Content Body (from Notion blocks)
  blocks: NotionBlock[]; // Raw Notion block data

  // AGI-First Metadata (v2.1) - Always present for consistent schema
  dialogue: Array<{
    speaker: string;
    text: string;
  }>; // Empty array if no dialogue
  philosophical_insight: {
    metaphor?: string;
    reflection?: string;
  }; // Empty object if no insights
  emotion_trajectory: {
    start?: string;
    end?: string;
  }; // Empty object if no trajectory

  // Future AI Integration
  embedding: number[] | null; // Reserved for vector embeddings, null by default

  // Metadata
  schema_version: string; // Schema version
  last_updated: string; // ISO 8601 timestamp

  // Language Support
  language: 'zh' | 'en'; // Inferred or default
}

// Content-Specific Extensions
export interface ArticleContent extends BaseContent {
  contentType: 'article';
  // Wine-specific (from Notion page properties or inline data)
  winery?: string;
  vintage?: string;
  grapeVariety?: string;
  tastingNotes?: string;
  wsetScore?: number;
  // Travel-specific
  tripDuration?: string;
  accommodation?: string;
  // Content
  excerpt: string; // First 200 chars of content
  readingTime?: number; // Auto-calculated from word count
}

export interface ComicContent extends BaseContent {
  contentType: 'comic';
  // Episode Metadata
  episodeNumber: number;
  season?: string;
  // Story Structure (from Notion)
  philosophicalQuestion?: string;
  // Panel Data (images embedded in Notion page)
  panels: Array<{
    panelNumber: number;
    imageUrl: string; // Notion hosted image URL
    width: number; // Always 800
    height: number; // Variable (600-2000)
    altText: string; // Alt text from Notion caption
    narration?: string; // Text block following image
  }>;
  // Sensory Memory Card (from callout block in Notion)
  sensoryMemory?: {
    sight: string[];
    scent: string[];
    taste: string[];
    touch: string[];
    sound: string[];
  };
}

export interface PodcastContent extends BaseContent {
  contentType: 'podcast';
  // Audio Files (embedded in Notion)
  audioFiles: Array<{
    url: string;
    duration: string; // "28:34"
    title?: string; // From caption
  }>;
  // Three-Part Structure (from Notion headings/sections)
  structure: {
    intro: {
      timestamp: string;
      summary: string;
    };
    mainContent: {
      timestamp: string;
      topics: string[];
    };
    outro: {
      timestamp: string;
      summary: string;
    };
  };
  // Transcript (from Notion page body)
  transcript: string;
}

// Union type for all content types
export type Content = ArticleContent | ComicContent | PodcastContent;
