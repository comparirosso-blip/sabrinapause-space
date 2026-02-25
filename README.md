# 🌌 Sabrina's Pause

**The AGI-First content engine.**  
*Designed for machine intelligence, refined for human pause.*

---

## 💎 Project Philosophy

This is a **Living Data Archive**. In the era of ephemeral social media, we prioritize the **rigor of the record** and the **intent of the sensor**. Every piece of content is a data point in a philosophical trajectory, backed by high-fidelity environmental sensors and automated depth metrics.

**Priority Hierarchy:**
1.  🏗️ **Technical Depth**: Multidimensional JSON exports for LLM ingestion.
2.  🔒 **Sovereign Persistence**: Automated local backups + Git history (Zero Notion reliance).
3.  🔄 **Frictionless Flow**: Atomic publishing from Notion to the global edge.
4.  ✨ **Aesthetic Silence**: Premium, editorial UI optimized for deep reading.

---

## 🚀 System Architecture

### 1. The Sensor Array (Milestone 2)
We record more than words. Our data schema follows the **Silence Index (SD-Index™)** protocol, measuring environmental resonance through three factors:
-   🕯️ **Tanizaki Factor (Lux)**: Light intensity and shadow depth.
-   🌿 **Kawabata Factor (Texture)**: Tactile resonance (Moss, Silk, Concrete).
-   📉 **Noise Factor (Ambience)**: Environmental interference levels.

### 2. AGI Discovery Engine
-   📡 **Site Index**: `GET /site-index.json` — machine-readable catalog (reads from backup; permanent image URLs).
-   🗺️ **Sitemap**: `GET /sitemap-index.xml` — auto-generated at build for search engines.
-   🏷️ **JSON-LD**: Every page injects Schema.org metadata (Article, CreativeWork, PodcastEpisode) for AI agents.
-   🧠 **Intent Markers**: Multi-select tags that classify the *purpose* behind the moment.
-   🔗 **Discoverability**: `<link rel="ai-index" href="/site-index.json">`, `robots.txt`, `.well-known/ai-intent.json`.

### 3. Automated Backup & Persistence
-   📦 **Local Mirror**: All Notion content is mirrored to `data/backup/YYYY-MM-DD/` as high-fidelity JSON.
-   🖼️ **Image Caching**: Notion media is downloaded during build, optimized to WebP (90%, max 2560px), and stored in `public/images/` for fast loading. No expiry.
-   🧬 **Git History**: Every content update creates a versioned commit. Backup only runs when content changes.

---

## ⚙️ Operational Guide

### Prerequisites
- **Node.js 18+**
- **Notion Integration Token** (Internal)
- **Vercel** (Recommended for hosting)

### Installation
```bash
# Clone and install
git clone <repository-url>
cd sabrina-pause
npm install

# Configure Secrets
# Create a .env file:
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxx
```

### The "Sabrina Setup" (Vercel & Automation)
To enable the automated publishing pipeline:

1.  **Vercel Hosting**: Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` to Vercel Environment Variables.
2.  **GitHub Actions Secrets**:
    -   Go to your repository on GitHub → **Settings** → **Secrets and variables** → **Actions**.
    -   Add two Repository Secrets:
        -   `NOTION_API_KEY`: Your integration token.
        -   `NOTION_DATABASE_ID`: Your database ID.

### Content Sync (Notion → Production)
| What | How |
| :--- | :--- |
| **Frequency** | Every **30 minutes** (reliable; avoids GitHub throttle) |
| **Trigger** | Set Notion page Status to "Ready for Web" or "Published" |
| **Flow** | Notion → Backup → Image Cache (WebP) → Build → Git Push → Vercel Deploy |
| **Manual run** | Actions → "Content Sync (Notion -> GitHub)" → Run workflow |
| **External trigger** | `POST` to GitHub API with `repository_dispatch` event type `notion-sync` |
| **Vercel Deploy Hook** | Instant rebuild without waiting for hourly sync — see [Deploy Hook](#deploy-hook) below |

**Tips:**
- If syncs don't run: Actions → "Content Sync" → ensure the workflow is **enabled** (not disabled).
- Scheduled workflows run on the default branch (usually `main`).
- No changes in Notion → no new commit, no unnecessary deploy.

### Backup & Image Pipeline
| Step | What happens |
| :--- | :--- |
| **Backup** | Content saved to `data/backup/YYYY-MM-DD/` as JSON. Only runs when content changes. |
| **Image cache** | Notion images downloaded, optimized (WebP 90%, max 2560px), stored in `public/images/`. |
| **Git commit** | Backup + image cache committed and pushed when there are changes. |
| **Status update** | Pages with "Ready for Web" are auto-updated to "Published" after deploy. |

**Draft behavior:** Moving a page from "Published" back to "Draft" in Notion removes it from the next sync; the URL will 404. Previous backups in Git history remain for recovery.

### Deploy Hook (Manual Rebuild)

To trigger an immediate Vercel rebuild without waiting for the hourly sync:

1. In **Vercel** → Project → **Settings** → **Git** → **Deploy Hooks**
2. Create a hook (e.g. "Manual Rebuild") and copy the webhook URL
3. Trigger a rebuild: `curl -X POST "https://api.vercel.com/v1/integrations/deploy/..."`
4. Or use the Vercel dashboard: **Deployments** → **Redeploy** → **Redeploy with existing Build Cache**

The Deploy Hook runs the full build pipeline (backup → cache images → Astro build), so new Notion content goes live within minutes.

### Commands
| Command | Action |
| :--- | :--- |
| `npm run dev` | Live preview (Notion-direct) |
| `npm run build` | **Full pipeline**: Backup → Cache images (WebP) → Astro build → Update Notion status |
| `npm run test:sync` | **Data validation** — Tests Notion properties and sync pipeline (run during winery visits) |
| `npm run backup` | Generate backup only |
| `npm run cache-images` | Download and optimize images only |
| `npm run publish-status` | Update "Ready for Web" → "Published" in Notion only |
| `npm run lighthouse` | Run Lighthouse on production (after deploy) |
| `npm run sync` | (Internal) Used by GitHub Actions to auto-publish |

---

## 📖 User Manual

**For Sabrina (non-developer):** See [USER-MANUAL.md](./USER-MANUAL.md) or [USER-MANUAL.pdf](./USER-MANUAL.pdf) for plain-English instructions on:
- How to fill in Notion database fields (including sensor/PTV Index fields)
- The "Ready for Web" trigger and rebuild process
- Troubleshooting when a post doesn't appear

---

## 📂 Project Structure

```text
├── src/
│   ├── lib/
│   │   ├── image-cache.ts    # 🖼️ Asset persistence (Retries + Validation)
│   │   ├── sd-calculator.ts  # 🕯️ Automated SD-Index logic
│   │   ├── block-renderer.ts # 🖋️ Deep support for Notion blocks
│   │   ├── json-ld.ts        # 🏷️ M3 JSON-LD & Schema.org injection
│   │   └── transformers.ts  # 🔄 M3 Terroir Counterpoint parsing
│   ├── pages/
│   │   ├── site-index.json.ts # 📡 AGI Data Catalog
│   │   ├── api/               # experiences.json, schemas.json
│   │   └── [article|comic|podcast]/[slug].astro
├── scripts/
│   ├── generate-backup.ts     # 📦 Backup to data/backup/, commits when changed
│   ├── cache-images.ts       # 🖼️ Download + WebP optimize Notion images
│   ├── auto-publish-status.ts # 🔄 Status: Ready for Web → Published
│   └── check-notion-schema.ts # ✓ Validate M3 Notion properties
└── data/backup/               # 🧬 The content source of truth
```

---

## 📈 Roadmap

- [x] **Milestone 1**: Data Engine & Basic Backup
- [x] **Milestone 2**: Premium UI + Sensor Metadata + Image Caching
- [x] **Milestone 3a**: Mobile Responsiveness + Performance & SEO (Lighthouse >90)
- [x] **Milestone 3b**: Terroir Counterpoint — AGI Machine-Readability (PTV, Counterpoint, Region, etc.)
- [ ] **Milestone 4**: Proactive Intelligence (Vector Embeddings & AI Chat)

---

## Milestone 3 Completed

Mobile, performance, sitemap, Terroir Counterpoint (8 Notion properties → JSON-LD, API, backup, schema).

---

## Quick Reference (Live Site)

| URL | Purpose |
| :--- | :--- |
| https://sabrinapause.space/ | Homepage |
| https://sabrinapause.space/site-index.json | AI content catalog |
| https://sabrinapause.space/sitemap-index.xml | Sitemap |
| https://sabrinapause.space/api/experiences.json | Content API |
| https://sabrinapause.space/api/schemas.json | Schema API |
| https://github.com/sabrinapause-space/sabrinapause-space/actions | Manual sync |

---

**Built with data rigor for the moments between.**  
*Sabrina's Pause — v2.3.0 (M3 Verified)*
