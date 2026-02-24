# Sabrina's Pause — User Manual (Plain English)

**For non-developers.** How to manage your site from Kyoto, Europe, or anywhere.

---

## Part 1: Notion Workflow — Filling In the Database

Your site pulls content from a Notion database. Each row is one piece of content (article, comic, or podcast). Here’s how to fill it in so it appears correctly.

### Required Fields (Must Fill)

| Field | What to enter | Example |
|-------|---------------|---------|
| **Title** | The main title of your post | "A Morning at Lake Tanuki" |
| **Slug** | URL-friendly version (lowercase, hyphens) | "morning-lake-tanuki" |
| **Content Type** | Choose: article, comic, or podcast | article |
| **Web Category** | e.g. Journal, Episodes, Podcast | Journal |
| **Status** | Set to "Ready for Web" when you want it live | Ready for Web |
| **Hero Image** | Cover image (drag & drop) | Upload a photo |
| **Date** | When it was published | 2026-02-15 |
| **Location** | Where it happened | Lake Tanuki, Shizuoka |

### Optional Fields (Sensor / PTV Index)

These help AI understand the “feel” of the moment. Fill them when you can, especially for winery visits.

| Field | What it is | Example |
|-------|------------|---------|
| **Lux** | Light level (number) | 150 (dim room), 2000 (bright) |
| **Texture** | Material feel (select one) | Moss, Snow, Silk, Concrete |
| **Noise** | Ambient sound (multi-select) | Add options like "Birds", "Traffic", "Silence" |
| **Space Pattern** | How the space is arranged | "Open courtyard" |
| **Time Velocity** | How fast time feels (number) | 0.5 (slow), 2 (fast) |
| **Intent Vector** | Tags for the purpose of the piece | Add options like "Reflection", "Documentation" |
| **Project** | Project tags | "Winery Tours 2026" |
| **Concepts** | Topic tags | "Terroir", "Humidity" |

**Tip:** Lux under 100 = candlelight (quieter feel). Lux over 2000 = harsh light. Texture "Snow" or "Moss" adds depth. "Traffic" or "Construction" in Noise lowers the contemplative score.

### SD-Index™ (Silence Index)

- If your database has an **SD-Index™** formula, it will auto-calculate from Lux, Texture, and Noise.
- If not, the site uses a default of 5.0.
- Range: 0 (noisy, harsh) to 10 (deep, quiet).

---

## Part 2: The "Ready to Post" Trigger

When a post is ready to go live:

### Step 1: Finish the page in Notion

- Fill in required fields.
- Add your content (text, images, etc.).
- Add optional sensor fields if you like.

### Step 2: Set Status to "Ready for Web"

- Open the page in Notion.
- Find the **Status** property.
- Change it from "Draft" (or anything else) to **"Ready for Web"**.

### Step 3: Trigger the rebuild

**Option A — Automatic (if GitHub Actions is set up)**

- Save the page in Notion.
- The site rebuilds automatically (about once per hour).
- No extra steps.

**Option B — Manual rebuild**

- Ask your developer to run: `npm run build`
- Or, if you use Vercel/Netlify: trigger a deploy from the dashboard.

### Step 4: After a successful build

- The Status in Notion will change from **"Ready for Web"** to **"Published"**.
- Your post will appear on the site.

---

## Part 3: Troubleshooting

### "My post doesn’t appear on the site"

1. **Check Status**  
   It must be "Ready for Web" or "Published". If it’s "Draft" or "In Progress", it won’t show.

2. **Check Slug**  
   Slug must be filled and unique (e.g. `my-winery-visit`). No spaces or special characters.

3. **Check Content Type**  
   Must be exactly: `article`, `comic`, or `podcast`.

4. **Wait for rebuild**  
   If using automatic sync, wait up to an hour. For manual builds, wait until the build finishes.

### "Images are broken or missing"

- Hero images from Notion can expire. The build process caches them locally.
- Run a fresh build: `npm run build`.
- If images still fail, re-upload the Hero Image in Notion and rebuild.

### "Wrong content type (e.g. article vs comic)"

- In Notion, change the **Content Type** field.
- Trigger a new build.
- The URL will follow the type: `/article/slug`, `/comic/slug`, `/podcast/slug`.

### "Sensor fields (Lux, Texture, etc.) not showing"

- Confirm the property exists in your Notion database.
- Add options to **Texture** and **Noise** if they are select/multi-select.
- Rebuild the site.

### "I need to unpublish something"

- In Notion, change Status to **"Archived"** or **"Draft"**.
- Trigger a rebuild. The post will no longer appear on the site.

---

## Part 4: Consistency for AI Crawlers

To keep the site easy for AI agents to understand:

1. **Use consistent slugs** — lowercase, hyphens, no special characters.
2. **Fill Location when possible** — helps with place-based content.
3. **Use Intent Vector and Concepts** — helps AI understand the purpose of each piece.
4. **Keep Status accurate** — only "Ready for Web" and "Published" appear on the site.

---

## Quick Reference

| I want to… | Do this… |
|------------|----------|
| Publish a new post | Set Status = "Ready for Web", then trigger rebuild |
| Unpublish a post | Set Status = "Archived" or "Draft", then rebuild |
| Fix a typo | Edit in Notion, then rebuild |
| Add sensor data | Fill Lux, Texture, Noise, etc. in Notion, then rebuild |
| Get help | Contact your developer with: page title, slug, and what you expected |

---

*Protocol Panthera — Built for consistency and AI readiness.*
