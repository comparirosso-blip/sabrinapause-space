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
**Budget:** $960  
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

**Automated pipeline:**
```
1. Fetch content (Status = "Ready for Web" OR "Published")
   ↓
2. Save JSON backups → data/backup/YYYY-MM-DD/
   ↓
3. git add + commit + push (🔒 GitHub backup!)
   ↓
4. Build static site
   ↓
5. Update Notion: "Ready for Web" → "Published"
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
│   │   ├── block-renderer.ts       # Block → HTML
│   │   └── backup-system.ts        # GitHub backup logic
│   ├── interfaces/
│   │   └── content-loader.ts       # ContentLoader interface
│   ├── pages/
│   │   ├── index.astro             # Gallery homepage
│   │   ├── [slug].astro            # Individual content pages
│   │   └── api/
│   │       ├── experiences.json.ts     # All content endpoint
│   │       ├── experiences/[slug].json.ts  # Single content endpoint
│   │       └── schemas.json.ts     # Schema definition endpoint
│   ├── layouts/
│   │   └── Layout.astro            # Base layout
│   ├── styles/
│   │   └── global.css              # Tailwind imports
│   └── types.ts                    # TypeScript definitions
├── scripts/
│   ├── generate-backup.ts          # Backup + auto-commit script
│   ├── auto-publish-status.ts      # Auto-status updater
│   └── generate-sample-json.ts     # Sample JSON generator
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
| Intent Vector | Text | Semantic purpose statement |
| SD-Index™ | Number | Symbiotic Depth Index (0-10) |
| Concepts | Multi-select | Concept tags |
| Hero Image | Files | Cover image |

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
| `npm run build` | **Production build** (full automation pipeline) |
| `npm run preview` | Preview built site locally |
| `npm run test` | Test Notion API connection |
| `npm run backup` | Manual backup (without build) |
| `npm run sample` | Generate sample JSON output |
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

## 📦 M1 Delivery Checklist

**What Sabrina expects to see:**

- [ ] **JSON API endpoints accessible**
  - Show working `/api/experiences.json`
  - Show working `/api/schemas.json`
  
- [ ] **GitHub backup visible in repo**
  - Point to `data/backup/` folder
  - Show organized structure (articles/, metadata.json)
  
- [ ] **Enhanced schema with AGI fields**
  - Run `npm run sample` to show output
  - Demonstrate `dialogue`, `embedding`, `schema_version`
  
- [ ] **Auto-publishing works**
  - Create test page in Notion
  - Set Status = "Ready for Web"
  - Run `npm run build`
  - Show page appears on site
  - Show status changed to "Published"

**Payment Release Trigger:**  
> "I will release this payment when I see the raw JSON data flowing."

---

## 🚧 Milestone 2: The Viewer (NEXT)

**Focus:** Enhanced JSON schema mapping + clean content rendering

- Page templates for articles/comics/podcasts
- Proper metadata display
- Comic image stacking (seamless vertical flow)
- Toggle blocks for author notes
- Navigation system

**Updated from original:** Comic viewer simplified (no text-to-comic engine needed).

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
- [M1 AGI-First Details](./MILESTONE1-AGI-FIRST.md) - Pivot documentation
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

| Milestone | Status | Budget | Description |
|-----------|--------|--------|-------------|
| **M1: Data Engine** | ✅ COMPLETE | $960 | JSON APIs + GitHub backup + Auto-status |
| **M2: The Viewer** | 🚧 NEXT | $960 | Templates + Enhanced schema mapping |
| **M3: Launch** | 📅 PLANNED | $480 | Mobile + SEO + Auto-rebuild |

**Total:** $2,400

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
