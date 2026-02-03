Technical Specification Document v2.0
Project: Sabrina's Pause - Dual-Layer Content Platform
Version: 2.0
Date: February 2, 2026
Client: Sabrina
Developer: Daniel
Project Type: Notion-Powered Static Site with AI-Ready Data Architecture
📋 TABLE OF CONTENTS
1. Project Overview
2. Core Architecture Philosophy
3. Technical Stack Requirements
4. Data Schema Specification
5. Content Type Definitions
6. Phase 1 Deliverables
7. Notion Integration Protocol
8. AI Integration Hooks
9. Visual Design Guidelines
10. Testing & Acceptance Criteria
11. Timeline & Budget
1. PROJECT OVERVIEW
1.1 Mission Statement
Build a dual-layer content platform that serves both human readers (Layer 1: Presentation)
and AI systems (Layer 2: Structured Data). The site archives a 52-year-old woman's life
journey through multiple content formats while ensuring semantic searchability for future AI
applications. Content is managed exclusively in Notion and automatically synchronized to
the web.
1.2 User Persona
Primary User: Sabrina (Content Creator)
●
Non-technical user who manages all content in Notion
●
●
Expects zero-friction publishing: edit in Notion → auto-update on web
Requires no CSS, HTML, or JSON file editing
End Users:
●
●
●
35-60 year old knowledge workers
Interest in life aesthetics, wine, travel, philosophy
Multilingual (Chinese primary, English secondary)
1.3 Reference Site
Visual/UX Inspiration: moonhoneytravel.com
●
●
●
●
Clean, minimal design
Photo-driven layout
Clear category navigation
BUT: Our site requires superior data architecture (Layer 2) and Notion-powered
content management
2. CORE ARCHITECTURE PHILOSOPHY
2.1 The Two-Layer Paradigm
┌─────────────────────────────────────────┐
│ LAYER 1: Human Presentation │
│ - Beautiful UI/UX │
│ - Images, typography, layout │
│ - SEO-optimized HTML │
└─────────────────────────────────────────┘
↕ (Generated From)
┌─────────────────────────────────────────┐
│ LAYER 2: AI-Readable Data │
│ - Notion API as Source of Truth │
│ - Semantic metadata │
│ - Structured relationships │
│ - Future-proof for AI ingestion │
└─────────────────────────────────────────┘
Critical Principles:
●
●
●
●
Layer 2 (Notion database) is the source of truth
Layer 1 is generated from Layer 2
Layer 2 must be format-agnostic (can migrate to any frontend framework)
Content flow is unidirectional: Notion → Web (never the reverse)
2.2 Design for Longevity
This is not a typical website that will be redesigned in 2 years. This is a digital life archive
that must remain accessible for decades. Therefore:
●
●
●
●
Data must be stored in open, non-proprietary formats (Notion exports to
Markdown/JSON)
Schema must be extensible without breaking existing data
Build system must be framework-agnostic where possible
Notion serves as the perpetual backup and editing environment
3. TECHNICAL STACK REQUIREMENTS
3.1 Recommended Stack
Framework: Astro (v4.x+)
●
●
Why: Optimal for content-heavy sites, great performance, supports multiple content
sources, excellent Notion API integration patterns
Alternative Acceptable: Next.js 14+ (App Router), but Astro preferred
Styling: Tailwind CSS
●
●
Why: Utility-first, maintainable, fast development
Use base Tailwind classes only (no custom config requiring compilation)
Content Source: Notion API (Direct Integration)
●
●
●
Why: Client's preferred writing environment, zero-friction publishing
Target Database: "Master Corpus" with view WEB_PUBLISH_VIEW
Critical: Site must poll/webhook Notion to auto-refresh content
Hosting: Vercel or Netlify
●
Why: Auto-deployment from GitHub, excellent performance, supports scheduled
rebuilds
●
Must support automatic rebuilds on Notion content changes (webhook or cron)
Version Control: GitHub
●
●
Why: Industry standard, enables CI/CD
Notion changes trigger automated deployments
3.2 Required Dependencies
{
"dependencies": {
"astro": "^4.0.0"
,
"tailwindcss": "^3.4.0"
,
"@notionhq/client": "^2.2.0"
,
"notion-to-md": "^3.1.0"
},
"devDependencies": {
"@astrojs/check": "^0.4.0"
,
"typescript": "^5.3.0"
}
}
3.3 Forbidden Dependencies
●
●
●
●
❌ No heavy JavaScript frameworks for rendering (React, Vue on client-side)
❌ No jQuery or legacy libraries
❌ No CSS frameworks requiring runtime compilation beyond Tailwind
❌ No local JSON file management (all content comes from Notion)
4. DATA SCHEMA SPECIFICATION
4.1 Notion Database Schema
Master Corpus Database Properties:
Property
Name
Type Purpose Require
d
Title Title Content headline ✅
Status Select Workflow state ✅
Web Category Select Navigation placement ✅
Slug Text URL-safe identifier ✅
Date Date Publication date ✅
Location Text Geographic context ✅
Project Multi-select Project tags (Wine Journey, Dear Human,
etc.)
✅
Content Type Select article / comic / podcast ✅
Intent Vector Text Semantic purpose metadata ✅
SD-Index™ Number Symbiotic Depth Index ✅
Concepts Multi-select High-level semantic tags ✅
Hero Image Files Cover image Optional
Publishing Workflow:
Draft → In Progress → Ready for Web → Published → Archived
Critical: Only pages with Status ==
view will be fetched by the website.
"Ready for Web" in the WEB_PUBLISH_VIEW
4.2 Universal Base Schema (Internal Representation)
After fetching from Notion, transform to this internal structure:
interface BaseContent {
// Required Fields
id: string; // Notion page ID
contentType: 'article' | 'comic' | 'podcast';
title: string;
date: string; // ISO 8601 format (YYYY-MM-DD)
slug: string; // From Notion "Slug" property
// Location Data
location: {
name: string; // e.g.,
coordinates?: { // Optional
lat: number;
lng: number;
"Lake Tanuki, Shizuoka"
};
};
// Taxonomy (from Notion properties)
webCategory: string; // Notion "Web Category"
project: string[]; // Notion "Project" multi-select
concepts: string[]; // Notion "Concepts" multi-select
// Cultural Legacy Markers
intentVector: string; // Notion "Intent Vector"
sdIndex: number; // Notion "SD-Index™"
// Media
heroImage?: string; // Notion "Hero Image" file URL
// Content Body (from Notion blocks)
blocks: NotionBlock[]; // Raw Notion block data
// Future AI Integration
embedding?: number[] | null; // Reserved for vector embeddings
// Language Support
language: 'zh' | 'en'; // Inferred or default
}
4.3 Content-Specific Extensions
4.3.1 Article Schema
interface ArticleContent extends BaseContent {
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
4.3.2 Comic Schema
interface ComicContent extends BaseContent {
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
4.3.3 Podcast Schema
interface PodcastContent extends BaseContent {
contentType: 'podcast';
// Audio File (embedded in Notion)
audioFile: {
url: string; // Notion hosted audio URL
duration: string; // "28:34"
};
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
4.4 JSON-LD Output Requirement
For every content page, generate valid JSON-LD structured data:
<script type="application/ld+json">
{
"@context": "https://schema.org"
,
"@type": "Article"
,
"headline": "{{title}}"
,
"datePublished": "{{date}}"
,
"author": {
"@type": "Person"
,
"name": "Sabrina"
},
"locationCreated": {
"@type": "Place"
,
"name": "{{location.name}}"
},
"keywords": "{{concepts.join('
,
"about": "{{intentVector}}"
,
"additionalProperty": [
{
')}}"
,
"@type": "PropertyValue"
,
"name": "SD-Index"
,
"value": "{{sdIndex}}"
}
]
}
</script>
5. CONTENT TYPE DEFINITIONS
5.1 Content Type Routing
Content routing is determined by the Web Category property in Notion:
/{webCategory}/{slug}
Examples:
/episodes/tanuki-lake → Comic
/journal/grace-koshu-2024 → Article
/podcast/ai-dialogue → Podcast
Dynamic Navigation:
The site menu is auto-generated from unique values in the Web Category property:
Navigation Menu:
├── Home
├── Episodes (if any content has Web Category = "episodes")
├── Journal (if any content has Web Category = "journal")
├── Podcast (if any content has Web Category = "podcast")
└── Archive (all content, filterable)
5.2 Project-Based Categorization
Content can also be browsed by Project tags:
/project/{project-slug}
Examples:
/project/wine-journey
/project/dear-human
/project/cke
6. PHASE 1 DELIVERABLES
6.1 Scope Definition
Goal: Deliver a fully functional Notion-powered website that automatically renders content
without manual file editing.
What IS in scope:
✅ Direct Notion API integration (fetch from WEB_PUBLISH_VIEW)
✅ Automated block-to-HTML rendering (Text, Headings, Images, Lists, Quotes)
✅ Dynamic navigation based on Notion properties
✅ Vertical scroll Webtoon viewer for comics (800px max width)
✅ Clean, minimal design (inspired by moonhoneytravel.com)
✅ Fully responsive (mobile-first)
✅ GitHub repo with CI/CD to Vercel/Netlify
✅ Webhook or scheduled rebuild on Notion updates
✅ Cultural legacy markers (Intent Vector, SD-Index™) displayed
What is NOT in scope:
❌ Manual JSON file management
❌ CMS UI (Notion IS the CMS)
❌ Advanced filtering/search beyond basic category
❌ User accounts or comments
❌ Complex animations
❌ Multilingual UI (Chinese-only acceptable, but schema supports language)
❌ Traditional horizontal comic layouts
6.2 Required Pages
6.2.1 Homepage (/)
Purpose: Showcase latest content across all types
Components:
●
●
●
●
Hero section: "Sabrina's Pause: Moments Between"
Mixed content grid (latest 9 items from Notion, any content type)
Each card:
○
Hero image
○
Title
○
Date
○
Web Category badge
○
2-line excerpt
○
Intent Vector pill (subtle display)
"View All" links to each category
Layout: Full-width, centered max-width 1200px
6.2.2 Category Index Pages (/{webCategory}/)
Purpose: Browse all content in a specific category
Components:
●
●
●
●
Page title from Web Category
Filter by Project (optional)
Grid/List of content cards
Pagination (20 items per page)
6.2.3 Article Detail (/journal/{slug})
Purpose: Display full article
Layout:
●
Hero image (full-width)
●
Title
●
●
Metadata bar: Date | Location | Web Category | Reading time
Cultural Legacy Display:
○
Intent Vector: "探索日本葡萄酒的風土哲學"
○
SD-Index™: 8.5/10
●
●
Notion blocks rendered sequentially (Text, Images, Quotes)
Related articles (same Project tag)
6.2.4 Comic Episode Detail (/episodes/{slug})
Purpose: Display full comic in vertical scroll (Webtoon) format
Layout:
●
●
●
●
●
●
●
●
CRITICAL: Vertical Scroll Only
Fixed-width content area (800px max)
Title + episode number
Date + location metadata
Progress indicator: "Panel 15 / 54"
Vertical scroll of all panels (image sequence)
Each panel:
○
800px width (exact)
○
Variable height (600-2000px)
○
Lazy loading (IntersectionObserver)
○
Alt text from Notion captions
Bottom metadata:
○
Sensory memory card (if present)
○
Philosophical question
○
Intent Vector & SD-Index™
Responsive Behavior:
/* Mobile (< 768px) */
.comic-container {
width: 100%;
padding: 0;
background: #000;
}
/* Desktop (≥ 768px) */
.comic-container {
max-width: 800px;
margin: 0 auto;
padding: 40px 20px;
background: #fafafa;
}
Performance Requirements:
●
●
●
●
Lazy load panels (3 above, 5 below current viewport)
Smooth 60fps scrolling
First Contentful Paint < 1.5s
Largest Contentful Paint < 2.5s
Explicitly Forbidden:
❌ Horizontal comic layouts
❌ Page-based navigation
❌ Click-through pagination
❌ Panel-by-panel "tap to advance"
6.2.5 Podcast Detail (/podcast/{slug})
Purpose: Listen to podcast with synchronized transcript
Layout:
●
●
●
●
Audio player (HTML5 <audio> with custom controls)
Chapter markers (Intro → Main → Outro) clickable
Collapsible transcript below player
Metadata sidebar:
○
Topics
○
Intent Vector & SD-Index™
○
Philosophical question
6.2.6 Project Archive (/project/{slug})
Purpose: View all content within a specific Project
Components:
●
●
●
●
Project title
Project description (from Notion)
Mixed cards (articles, comics, podcasts with this Project tag)
Chronological or reverse chronological sort
6.2.7 Global Archive (/archive/)
Purpose: View all content with filtering
Components:
●
Filter controls:
○
Content type (All, Comics, Articles, Podcasts)
●
●
○
Web Category (dynamic from Notion)
○
Project (dynamic from Notion)
Results as mixed cards
Pagination (20 items per page)
6.2.8 About Page (/about/)
Purpose: Introduce Sabrina, Kenji, and the project
Content: Fetched from a dedicated Notion page with Slug =
"about"
7. NOTION INTEGRATION PROTOCOL
7.1 API Connection Logic
Target View: WEB_PUBLISH_VIEW in the "Master Corpus" database
Filter Requirement:
const response = await notion.databases.query({
database
_
id: process.env.NOTION
DATABASE
_
_
filter: {
property: "Status"
,
select: {
equals: "Ready for Web"
ID,
}
}
});
Property Mapping:
Notion Property Internal Field Usage
Title title Page headline
Slug slug URL path
Status (filter only) Publishing gate
Web Category webCategory Navigation/routing
Date date Publication date
Location location.na
me
Geographic metadata
Project project[] Project tags
Content Type contentType article/comic/podcast
Intent Vector intentVecto
r
Cultural legacy marker
SD-Index™ sdIndex Symbiotic depth metric
Concepts concepts[] Semantic tags
Hero Image heroImage Cover image URL
7.2 Block Rendering Strategy
Sequential Rendering: Render Notion blocks in the exact order they appear in the page
body.
Supported Block Types:
Notion Block HTML Output
Paragraph <p>
Heading 1 <h1>
Heading 2 <h2>
Heading 3 <h3>
Image <img> with lazy loading
Bulleted List <ul><li>
Numbered List <ol><li>
Quote <blockquote>
Callout <div
class=
"callout">
Image Handling:
●
Extract Notion-hosted image URLs
●
For comics: Verify 800px width constraint
●
●
Implement lazy loading via IntersectionObserver
Use Notion captions as alt text
CSS Component Mapping:
// Example: notion-to-md transformation
const blockToHTML = (block: NotionBlock) => {
switch (block.type) {
case 'paragraph':
return
`<p class="prose">${block.text}</p>`
;
case 'heading_
1':
return
`<h1 class="text-4xl font-bold mb-4">${block.text}</h1>`
;
case 'image':
return
`<img src="${block.url}" alt="${block.caption}" class="w-full" loading="lazy" />`
;
// ... other cases
}
};
7.3 Live Sync Strategy
Option 1: Webhook (Recommended)
●
●
Notion doesn't natively support webhooks
Use a service like Zapier or Make to trigger Vercel deployment webhook when Notion
pages are updated
Option 2: Scheduled Polling
// In Vercel, set up a cron job
// vercel.json
{
"crons": [{
"path": "/api/rebuild"
,
"schedule": "*/10 * * * *" // Every 10 minutes
}]
}
Option 3: Manual Trigger
●
●
Client triggers rebuild via Vercel dashboard
Fallback if automation fails
7.4 Content Loader Abstraction
Build a clean abstraction layer:
// content-loader.ts
interface ContentLoader {
getAll(contentType?: string): Promise<BaseContent[]>;
getBySlug(slug: string): Promise<BaseContent | null>;
getByProject(projectSlug: string): Promise<BaseContent[]>;
}
// implementations/notion-loader.ts
class NotionLoader implements ContentLoader {
async getAll(contentType?: string): Promise<BaseContent[]> {
// Fetch from WEB
PUBLISH
VIEW
_
_
// Transform Notion pages to BaseContent
}
}
}
async getBySlug(slug: string): Promise<BaseContent | null> {
// Query Notion for specific slug
async getByProject(projectSlug: string): Promise<BaseContent[]> {
// Filter by Project property
}
Why: This abstraction allows future migration to other CMSs without rewriting page
templates.
8. AI INTEGRATION HOOKS
8.1 Cultural Legacy Markers
Every page must display:
<div class="metadata-layer2">
<div class="intent-vector">
<span class="label">Intent Vector:</span>
<span class="value">{{intentVector}}</span>
</div>
<div class="sd-index">
<span class="label">SD-Index™:</span>
<span class="value">{{sdIndex}}/10</span>
</div>
</div>
Styling: Subtle, non-intrusive (small font, muted color)
Purpose: Demonstrates this is co-created content with AI, not generic AI output
8.2 Reserved Fields
These fields must be present in the internal schema but may be empty:
{
}
embedding?: number[] | null; // Always null in Phase 1
Why: Enables future vector similarity search
8.3 Structured Data for AI Crawlers
Include Intent Vector and SD-Index™ in JSON-LD as shown in Section 4.4.
9. VISUAL DESIGN GUIDELINES
9.1 Design Principles
Inspired by: moonhoneytravel.com
Key Characteristics:
●
●
●
●
●
Generous whitespace: Never feel cramped
Photo-first: Images are heroes, not decorations
Minimal UI: No unnecessary chrome
Readable typography: Body text ≥ 18px
Subtle interactions: Hover states, no flashy animations
9.2 Design System
Typography:
--font-heading: 'SF Pro'
,
'Segoe UI'
, sans-serif;
--font-body-ui: 'SF Pro'
,
'Segoe UI'
, sans-serif;
--font-body-content: 'Georgia'
'Times'
,
, serif;
--font-chinese: 'Noto Sans TC'
'Noto Serif TC'
,
, sans-serif;
Colors (Muted Palette):
--color-primary: #2C3E50; /* Dark slate */
--color-secondary: #8B7355; /* Warm brown */
--color-accent: #C9A87B; /* Pale gold */
--color-background: #FAF9F6; /* Off-white */
--color-text: #2C2C2C;
--color-text-muted: #6C6C6C;
Spacing:
●
●
●
Use Tailwind default spacing scale
Max content width: 1200px
Generous whitespace
Component Library:
●
●
●
●
●
Card (reusable for all content types)
Badge (for categories, episode numbers)
Button (primary, secondary, ghost)
Audio Player (custom HTML5 controls)
Progress Indicator (for comics)
9.3 Responsive Breakpoints
/* Mobile-first */
--breakpoint-sm: 640px; /* Tablet */
--breakpoint-md: 768px; /* Small desktop */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
Layout Behavior:
●
●
●
●
Mobile (< 640px): Single column
Tablet (640-1024px): 2-column grid
Desktop (> 1024px): 3-column grid
Comics: Always vertical scroll, width adjustments only
10. TESTING & ACCEPTANCE CRITERIA
10.1 Functional Testing Checklist
Notion Integration:
●
●
●
●
●
[ ] Successfully connects to Notion API
[ ] Fetches only pages with Status ==
"Ready for Web"
[ ] Transforms Notion properties to internal schema
[ ] Renders Notion blocks in correct sequential order
[ ] Handles missing optional fields gracefully
Content Display:
●
●
●
●
[ ] All 3 content types display correctly (comics, articles, podcasts)
[ ] Images from Notion load correctly and are optimized
[ ] Podcast audio player works (play, pause, seek)
[ ] Comic panels display in vertical scroll format (800px max width)
Navigation:
●
●
●
●
[ ] Menu is dynamically generated from Web Category values
[ ] Project pages are auto-generated from Project tags
[ ] All internal links work
[ ] No 404 errors on valid routes
Performance:
●
●
●
●
[ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
[ ] Images are lazy-loaded
[ ] Comic panel lazy loading works (IntersectionObserver)
[ ] Page load time < 2 seconds on 3G
Responsive Design:
●
●
●
●
●
[ ] Site works on mobile (375px width)
[ ] Site works on tablet (768px width)
[ ] Site works on desktop (1440px width)
[ ] Comic vertical scroll works on all viewports
[ ] No horizontal scrolling on any viewport
Schema Compliance:
●
●
●
[ ] Every page has valid JSON-LD structured data
[ ] Intent Vector and SD-Index™ are displayed
[ ] Schema.org validator passes
Live Sync:
●
●
●
[ ] Notion updates trigger site rebuild (webhook or cron)
[ ] New content appears within 10-15 minutes of status change
[ ] Editing existing content updates the live site
10.2 Acceptance Test Cases
Test Case 1: Publish New Article from Notion
1. Create new page in Notion Master Corpus
2. Fill in all required properties (Title, Slug, Web Category, etc.)
3. Add content blocks (Text, Images, Quotes)
4. Change Status to "Ready for Web"
5. Wait for rebuild (≤ 15 minutes)
6. Verify article appears at correct URL
7. Verify all metadata displays correctly
8. Verify Intent Vector and SD-Index™ are visible
Test Case 2: Publish New Comic Episode
1. Create new comic page in Notion
2. Upload 800px-width panel images
3. Add sequential panel images with captions
4. Add sensory memory callout block
5. Set Status to "Ready for Web"
6. Verify vertical scroll display
7. Verify lazy loading works
8. Verify progress indicator updates
Test Case 3: Update Existing Content
1. Edit published Notion page
2. Change title or add new paragraph
3. Verify changes appear on live site after rebuild
4. Verify URL (slug) remains unchanged
Test Case 4: Dynamic Navigation
1. Create content with new Web Category value
2. Publish content
3. Verify new category appears in site navigation
4. Verify category page lists the new content
10.3 Browser Compatibility
Must work on:
●
●
●
●
●
Chrome (latest)
Firefox (latest)
Safari (latest)
Mobile Safari (iOS 15+)
Chrome Mobile (Android)
11. TIMELINE & BUDGET
11.1 Phase 1 Implementation Roadmap
Total Estimated Time: 15-18 hours
Milestone 1: Infrastructure & Notion Pipeline (40%)
Duration: 6-7 hours
Budget: $465-$540
Deliverables:
●
●
●
Setup Astro + Tailwind repo
Implement NotionLoader class
Connect to Notion API
●
●
●
Fetch data from WEB_PUBLISH_VIEW
Transform Notion pages to internal schema
Unit tests for data fetching
Acceptance Criteria:
●
●
●
Console logs successfully show structured content from Notion
All required properties are mapped correctly
Block rendering pipeline is functional
Milestone 2: Templates & Rendering (40%)
Duration: 6-7 hours
Budget: $465-$540
Deliverables:
●
●
●
●
●
●
Build 3 core page layouts (Article, Comic, Podcast)
Implement vertical scroll viewer for comics
Render Notion blocks (Text, H1-H3, Image, Quote, List) to HTML
Dynamic navigation component
Category and Project archive pages
Cultural legacy marker displays
Acceptance Criteria:
●
●
●
●
All page types render correctly with sample Notion data
Comic vertical scroll works with 800px constraint
Navigation menu auto-generates from Notion properties
Intent Vector and SD-Index™ display correctly
Milestone 3: Polish & Deployment (20%)
Duration: 3-4 hours
Budget: $230-$310
Deliverables:
●
●
Responsive design adjustments (Mobile/Desktop)
SEO/JSON-LD tags on all pages
●
●
●
●
Live sync setup (webhook or cron)
Final deployment to Vercel/Netlify
README documentation
Client handoff training
Acceptance Criteria:
●
●
●
●
Site is fully responsive
Lighthouse scores > 90
Notion updates trigger rebuilds
Client can publish new content from Notion without developer assistance
11.2 Budget Summary
Hourly Rate: $77.50
Budget Scenarios:
●
●
●
Tight (15 hours): $1,162.50 USD
Target (16.5 hours): $1,278.75 USD
Comfortable (18 hours): $1,395 USD
Recommended Budget: $1,200 - $1,400 USD
This allows for Notion API integration complexity while staying within the original budget
range.
11.3 Payment Structure
Milestone 1 (40% - $480-560):
Upon successful Notion API integration and data transformation
Milestone 2 (40% - $480-560):
Upon completion of all page templates and rendering
Milestone 3 (20% - $240-280):
Upon final deployment and client acceptance
12. DELIVERABLES SUMMARY
Upon completion, client receives:
1. GitHub Repository with:
○
○
○
Astro site with Notion integration
Clean, well-commented code
Comprehensive README.md
○
Environment variable template
2. Deployed Site on Vercel/Netlify:
○
Auto-rebuild configured (webhook or cron)
○
Client has admin access
○
Live Notion synchronization
3. Documentation:
○
○
○
○
Notion database schema reference
Content publishing guide (Notion workflow)
Troubleshooting guide
Developer handoff notes
4. Assets:
○
○
○
Reusable component library
Design system (Tailwind config)
Cultural legacy marker templates
13. OUT OF SCOPE
The following are explicitly not included in Phase 1:
❌ Advanced search functionality (full-text search, faceted filters)
❌ Tag cloud or advanced tag filtering
❌ AI-powered content recommendations
❌ Comments system
❌ Newsletter integration
❌ Analytics dashboard
❌ Multilingual UI (though schema supports it)
❌ RSS feed generation
❌ Advanced SEO tools (sitemap auto-generation is OK)
❌ Content versioning/history
❌ Draft preview mode
These can be scoped for future phases after Phase 1 proves the architecture works.
14. COMMUNICATION & QUESTIONS
14.1 Clarification Process
If any part of this spec is unclear:
1. Check if the answer is in the Notion schema or integration protocol
2. Ask specific technical questions
3. Format questions as:
○
"For [X feature], should I implement [Option A] or [Option B]?"
○
"The spec says [Y], but I see a potential issue with [Z]. How should I handle
this?"
14.2 Change Request Process
If during development you identify:
●
●
●
A better technical approach
A schema improvement
A scope reduction to stay on budget
Communicate early: Propose the change with:
●
●
●
What you want to change
Why (technical rationale)
Impact on timeline/budget
15. ACCEPTANCE CRITERIA SUMMARY
Phase 1 is considered complete when:
✅ Site successfully fetches content from Notion WEB_PUBLISH_VIEW
✅ All 3 content types (article, comic, podcast) display correctly
✅ Notion blocks render in sequential order (Text, Images, Quotes, etc.)
✅ Navigation menu auto-generates from Notion properties
✅ Comics display in vertical scroll format (800px max width)
✅ Site is fully responsive (mobile, tablet, desktop)
✅ Lighthouse scores > 90 across all pages
✅ Intent Vector and SD-Index™ display on all content pages
✅ Live sync works (Notion updates → site rebuild)
✅ Client can publish new content from Notion without developer help
✅ GitHub repo is clean and documented
✅ Site deployed to Vercel/Netlify with auto-rebuild
Client will verify by:
●
●
●
●
Creating a test article, comic, and podcast in Notion
Changing Status to "Ready for Web"
Confirming content appears correctly on the live site within 15 minutes
Confirming the process is documented and followable
16. REFERENCE MATERIALS
16.1 Visual Reference
Primary: https://www.moonhoneytravel.com
●
●
●
●
Study use of whitespace
Study card layouts
Study photo presentation
But: Our Notion-powered architecture is more sophisticated
16.2 Technical References
●
●
●
●
●
Notion API: https://developers.notion.com
Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
notion-to-md: https://github.com/souvikinator/notion-to-md
Tailwind CSS: https://tailwindcss.com/docs
Schema.org: https://schema.org
16.3 Webtoon Format References
Study for comic implementation:
●
●
●
LINE Webtoon: https://www.webtoons.com
Tapas: https://tapas.io
Lezhin Comics: https://www.lezhin.com
Key observations:
●
●
●
●
800px fixed width
Seamless vertical scroll
Minimal UI
Fast lazy loading
FINAL NOTES
This specification represents the complete technical blueprint for Phase 1 with Notion
integration.
Success = A working site where:
●
●
●
●
●
Sabrina edits content exclusively in Notion
The site automatically reflects Notion changes within 15 minutes
The vertical scroll comic format works flawlessly
The visual design is clean and inspired by moonhoneytravel.com
Cultural legacy markers (Intent Vector, SD-Index™) are prominently displayed
●
The Layer 2 foundation is ready for future AI integration
Future phases will build on this foundation with advanced search, AI recommendations, and
deeper analytics.
But Phase 1 must be rock-solid before we proceed.
Questions? Ask early and often. Clarity now = smooth execution later.
Document End