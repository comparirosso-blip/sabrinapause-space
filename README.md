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
-   📡 **Site Index**: `GET /site-index.json` provides a machine-readable catalog of every intent-vector.
-   🏷️ **JSON-LD**: Every page injects custom structured data for AI agents.
-   🧠 **Intent Markers**: Multi-select tags that classify the *purpose* behind the moment.

### 3. Automated Backup & Persistence
-   📦 **Local Mirror**: All Notion content is mirrored to `data/backup/` as high-fidelity JSON.
-   🖼️ **Image Caching**: All Notion media is downloaded locally during build (3-tier retry protection) to prevent link expiration.
-   🧬 **Git History**: Every content update creates a versioned commit in this repository.

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

### The "Sabrina Setup" (Vercel)
To enable the automated publishing pipeline:
1.  **Production**: Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` to Vercel Environment Variables.
2.  **Automation**: The build will automatically skip Git commits in Vercel while mirroring assets locally.

### Commands
| Command | Action |
| :--- | :--- |
| `npm run dev` | Live preview (Notion-direct, high frequency) |
| `npm run build` | **Full Pipeline**: Backup → Image Sync → Static Build → Notion Status Update |
| `npm run test` | Verify Notion connection & sensor mapping |

---

## 📂 Project Structure

```text
├── src/
│   ├── lib/
│   │   ├── image-cache.ts    # 🖼️ Asset persistence (Retries + Validation)
│   │   ├── sd-calculator.ts  # 🕯️ Automated SD-Index logic
│   │   └── block-renderer.ts # 🖋️ Deep suport for Notion blocks
│   ├── pages/
│   │   ├── site-index.json.ts # 📡 AGI Data Catalog
│   │   └── [types]/[slug].astro # 🎨 Type-optimized templates
├── scripts/
│   ├── generate-backup.ts     # 📦 CI-aware Git backup script
│   └── auto-publish-status.ts # 🔄 Status: Ready → Published
├── data/backup/               # 🧬 The content source of truth
└── tests/                     # 🧪 Logic verification suites
```

---

## 📈 Roadmap

- [x] **Milestone 1**: Data Engine & Basic Backup
- [x] **Milestone 2**: Premium UI + Sensor Metadata + Image Caching
- [ ] **Milestone 3**: Proactive Intelligence (Vector Embeddings & AI Chat)

---

**Built with data rigor for the moments between.**  
*Sabrina's Pause — v2.2.0 (Verified)*
