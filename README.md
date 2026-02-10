# Sabrina's Pause

**AGI-First Content Archive** — A Notion-powered static website prioritizing structured data for AI consumption.

> *"We are building for AGI first, and humans second."*  
> — Sabrina Lin, v2.1 Pivot

---

## 🎯 Project Philosophy

This is a **Data Engine**, not just a website. The core focus is creating machine-readable, semantically rich JSON archives of content, with a human-friendly viewer as a secondary layer.

**Priority Order:**
1. **Data Rigor** - Structured, versioned JSON with AGI-ready metadata
2. **Data Independence** - Full ownership via GitHub backups
3. **Automation** - Zero-friction publishing from Notion → GitHub → Web
4. **Visual Presentation** - Functional, clean UI (not over-engineered)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Notion account with integration access
- Git repository

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd sabrina-pause

# 2. Install dependencies
npm install

# 3. Configure Notion API
# Create .env file with your credentials:
echo "NOTION_API_KEY=secret_your_notion_token" > .env
echo "NOTION_DATABASE_ID=your_database_id" >> .env

# 4. Connect Notion Database
# In Notion: ... menu → Connections → Add your integration

# 5. Test connection
npm run test

# 6. Start development server
npm run dev
```

---

## 📋 Milestone 1: AGI-First Data Engine ✅

**Status:** COMPLETE  
**Delivery:** Raw JSON data flowing + GitHub backup

### Core Deliverables

#### 1. JSON API Endpoints ✅
Public HTTP endpoints for AI consumption:

```
GET /api/experiences.json         → All published content
GET /api/experiences/{slug}.json  → Single content item
GET /api/schemas.json             → Schema definition
```

**Usage:**
```bash
curl https://yoursite.com/api/experiences.json
```

#### 2. GitHub Backup System ✅
**Data Independence** - Full ownership of content outside Notion.

**Auto-triggers on every build:**
- Fetches all "Ready for Web" content
- Saves to `data/backup/YYYY-MM-DD/`
  - `all-experiences.json` - Master list
  - `metadata.json` - Statistics & index
  - `articles/` - Individual article files
  - `comics/` - Individual comic files
  - `podcasts/` - Individual podcast files
- **Auto-commits to git**
- **Auto-pushes to GitHub**

**Smart Detection:** Only creates new backup if content changed.

#### 3. Enhanced JSON Schema ✅
AGI-ready metadata fields (v2.1):

```json
{
  "dialogue": [],                    // For comics/scripts
  "philosophical_insight": {},       // Metaphors & reflections
  "emotion_trajectory": {},          // Emotional arc
  "embedding": null,                 // Reserved for vector embeddings
  "schema_version": "1.0",           // Schema versioning
  "last_updated": "2026-02-07...",   // ISO timestamp
  "language": "zh" | "en"            // Inferred language
}
```

#### 4. Auto-Status Update ✅
After successful build, automatically updates Notion:
```
"Ready for Web" → "Published"
```

#### 5. Gallery Website ✅
Minimal, functional viewer:
- Clean gallery-style homepage
- Individual content pages
- Hero images from Notion
- Clickable navigation
- Responsive design

---

## 🔄 Publishing Workflow

### Development Mode
```bash
npm run dev
```
- Live preview at `localhost:4321`
- Fetches from Notion on each page load
- **No backup, no commits**

### Production Build
```bash
npm run build
```

**Automated pipeline (M2 Enhanced):**
```
1. Fetch content (Status = "Ready for Web" OR "Published")
   ↓
2. Save JSON backups → data/backup/YYYY-MM-DD/
   ↓
3. Cache images → public/images/ (M2)
   ↓
4. Auto-calculate SD-Index if empty (M2)
   ↓
5. git add + commit + push (🔒 GitHub backup!)
   ↓
6. Build static site with templates (M2)
   ↓
7. Generate /site-index.json for AGI (M2)
   ↓
8. Update Notion: "Ready for Web" → "Published"
```

### Deploy
```bash
# Upload dist/ folder to your hosting platform
# (Vercel, Netlify, etc.)
```

---

## 📁 Project Structure

```
sabrina-pause/
├── src/
│   ├── lib/
│   │   ├── notion-loader.ts        # Notion API client
│   │   ├── transformers.ts         # Data transformation
│   │   ├── block-renderer.ts       # Block → HTML (M2 enhanced)
│   │   ├── backup-system.ts        # GitHub backup logic
│   │   ├── image-cache.ts          # Image caching system (M2)
│   │   └── sd-calculator.ts        # Automated SD-Index calculation (M2)
│   ├── interfaces/
│   │   └── content-loader.ts       # ContentLoader interface
│   ├── pages/
│   │   ├── index.astro             # Gallery homepage with filters
│   │   ├── article/
│   │   │   └── [slug].astro        # Article template (M2)
│   │   ├── comic/
│   │   │   └── [slug].astro        # Comic/Webtoon template (M2)
│   │   ├── podcast/
│   │   │   └── [slug].astro        # Podcast template (M2)
│   │   └── api/
│   │       ├── experiences.json.ts     # All content endpoint
│   │       ├── experiences/[slug].json.ts  # Single content endpoint
│   │       ├── schemas.json.ts     # Schema definition endpoint
│   │       └── site-index.json.ts  # AGI site index (M2)
│   ├── layouts/
│   │   └── Layout.astro            # Base layout with AGI meta tags
│   ├── styles/
│   │   └── global.css              # Tailwind imports
│   └── types.ts                    # TypeScript definitions
├── scripts/
│   ├── generate-backup.ts          # Backup + auto-commit script
│   ├── cache-images.ts             # Image caching script (M2)
│   └── auto-publish-status.ts      # Auto-status updater
├── public/
│   ├── images/                     # Cached images (M2)
│   ├── robots.txt                  # With AI Intent Index (M2)
│   └── .well-known/
│       └── ai-intent.json          # AGI discovery endpoint (M2)
├── tests/
│   └── notion-connection.test.js   # Notion API test
├── data/backup/                    # JSON backups (committed to git)
│   └── YYYY-MM-DD/
│       ├── all-experiences.json
│       ├── metadata.json
│       └── articles/
├── context.md                      # Technical specification
└── .env                            # API credentials (not committed)
```

---

## 🎨 Content Management

### Notion Database Schema

**Required Properties:**

| Property | Type | Description |
|----------|------|-------------|
| Name/Title | Title | Content title |
| Status | Select | Draft, Ready for Web, Published, In Progress, Archived |
| Slug | Text | URL-safe identifier (e.g., "my-article") |
| Content Type | Select | article, comic, podcast |
| Web Category | Select | journal, episodes, podcast |
| Date | Date | Publication date |
| Location | Text | Geographic location |
| Project | Multi-select | Project tags |
| Intent Vector | Multi-select | Semantic purpose tags |
| Intent_Marker | Multi-select | Intent classification tags (M2) |
| SD-Index™ | Formula/Number | Symbiotic Depth Index (0-10, auto-calculated if empty) |
| Concepts | Multi-select | Concept tags |
| Hero Image | Files | Cover image |

**Hidden Sensor Fields (M2):**

| Property | Type | Description |
|----------|------|-------------|
| Lux | Number | Light intensity measurement (Tanizaki Factor) |
| Texture | Select | Tactile/material quality (Kawabata Factor) |
| Noise | Multi-select | Ambient sound categories (Noise Factor) |
| Space Pattern | Text | Spatial configuration |
| Time Velocity | Number | Temporal flow perception |

### Publishing Flow

1. **Create** content in Notion
2. **Set Status** → "Ready for Web"
3. **Build** → `npm run build`
4. **Auto-magic:**
   - Content appears on site
   - JSON backed up to GitHub
   - Status changes to "Published"

---

## 🔧 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (live preview, no backup) |
| `npm run build` | **Production build** (backup → cache images → build → publish) |
| `npm run preview` | Preview built site locally |
| `npm run test` | Test Notion API connection |
| `npm run backup` | Manual backup (without build) |
| `npm run cache-images` | Cache Notion images to local storage (M2) |
| `npm run publish-status` | Manual status update (without build) |

---

## 🧪 Testing

### Test Notion Connection
```bash
npm run test
```
Shows all "Ready for Web" pages with their properties.

### Test JSON API Endpoints
```bash
npm run dev
# Then:
curl http://localhost:4321/api/experiences.json
curl http://localhost:4321/api/schemas.json
curl http://localhost:4321/site-index.json  # M2: AGI Site Index
```

### Test Backup System
```bash
npm run backup
# Check: data/backup/YYYY-MM-DD/ folder created
```

### Test Full Pipeline
```bash
npm run build
# Checks:
# ✅ Backup files in data/backup/
# ✅ Git commit created
# ✅ dist/ folder generated
# ✅ Notion status updated
```

---

## 📋 Milestone 2: Frontend Build + AGI Logic ✅

**Status:** COMPLETE  
**Delivery:** Content templates + AGI discoverability + Auto SD-Index

### Core Deliverables

#### 1. Content Templates ✅
Professional templates for each content type:
- **Article Template** - Typography-optimized, reading time, JSON-LD
- **Comic/Webtoon Template** - Vertical scroll (800px), lazy loading, progress bar
- **Podcast Template** - HTML5 player, playback speed control, transcript tabs

#### 2. Enhanced Block Renderer ✅
Full Notion block support:
- Headings, paragraphs, lists (bulleted, numbered, to-do)
- Rich text formatting (bold, italic, code, links)
- Images with captions, videos, files, embeds
- Quotes, callouts, code blocks, dividers
- Bookmarks, toggles, table of contents

#### 3. Image Caching System ✅
**CRITICAL:** Downloads Notion images during build to prevent URL expiration
- Images saved to `/public/images/`
- Permanent local paths replace temporary S3 URLs
- Integrated into build pipeline

#### 4. AGI Discoverability ✅
Machine-readable site index for AI consumption:
- `/site-index.json` - Full content catalog with Intent_Marker arrays
- `<link rel="ai-index">` in every page head
- `robots.txt` updated with AI Intent Index comment
- `/.well-known/ai-intent.json` endpoint

#### 5. Automated SD-Index Calculation ✅
Auto-calculates Silence Index when Notion formula is empty:
- **Tanizaki Factor** - Light (Lux) measurement
- **Kawabata Factor** - Texture (Snow, Moss, Concrete)
- **Noise Factor** - Environmental interference
- Returns 0-10 score displayed on frontend

#### 6. Content Routing & Navigation ✅
- Type-specific URLs: `/article/{slug}`, `/comic/{slug}`, `/podcast/{slug}`
- Homepage filtering by content type (All, Articles, Comics, Podcasts)
- Responsive gallery layout

---

## 🎯 Milestone 3: Launch (PLANNED)

- Mobile responsiveness
- Lighthouse score >85
- Auto-rebuild stability
- SEO optimization

---

## 🛠️ Tech Stack

- **Framework:** Astro 5.x (Static Site Generation)
- **Styling:** Tailwind CSS 4.x (Utility-first)
- **Content:** Notion API 2.x
- **Language:** TypeScript + ES Modules
- **Build:** Node.js 18+
- **Hosting:** Vercel/Netlify (TBD)

---

## 📚 Documentation

- [Technical Specification](./context.md) - Full project spec
- [Notion API Docs](https://developers.notion.com)
- [Astro Documentation](https://docs.astro.build)

---

## 🐛 Troubleshooting

### API Token Invalid
```bash
# 1. Go to https://www.notion.so/my-integrations
# 2. Copy your Internal Integration Token
# 3. Update .env:
NOTION_API_KEY=secret_your_new_token_here
```

### Pages Not Appearing
Check Notion database:
- Status must be "Ready for Web" or "Published"
- All required properties filled
- Database shared with integration

### Backup Not Creating
```bash
# Check last backup date:
ls -la data/backup/

# If no changes detected, backup is skipped
# Add new content or edit existing to trigger backup
```

---

## 📊 Project Status

| Milestone | Status | Description |
|-----------|--------|-------------|
| **M1: Data Engine** | ✅ COMPLETE | JSON APIs + GitHub backup + Auto-status |
| **M2: Frontend + AGI** | ✅ COMPLETE | Templates + Image caching + AGI discoverability + SD-Index |
| **M3: Launch** | 📅 PLANNED | Mobile optimization + SEO + Performance tuning |

---

## 🔐 Environment Variables

Create `.env` in project root:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx
```

**Security:** Never commit `.env` to git (already in `.gitignore`).

---

## 💡 Key Concepts

### SD-Index™ (Symbiotic Depth Index)
Scale 0-10 measuring content depth and philosophical resonance.

### Intent Vector
Semantic purpose statement capturing the "why" of the content.

### AGI-First Architecture
Data structure designed for machine learning consumption:
- Versioned schemas
- Reserved embedding fields
- Structured dialogue format
- Emotion trajectory tracking

---

## 📞 Support

For questions or issues, contact the developer.

---

**Built with data rigor over visual perfection.**  
*Sabrina's Pause — Moments Between*
