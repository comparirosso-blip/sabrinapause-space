# Sabrina's Pause — User Manual (Plain English)

Hey Sabrina,

This is your guide for managing sabrinapause.space. Everything is written in plain English — no coding required. You can run the whole thing from Kyoto, Europe, or anywhere.

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
| **Counterpoint** | Relation — link related articles | Select other pages from the same database |

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

**Option B — Manual rebuild (instant)**

- Open this link in your browser to trigger a rebuild: [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2)
- Or ask your developer to run: `npm run build`

### Step 4: After a successful build

- The Status in Notion will change from **"Ready for Web"** to **"Published"**.
- Your post will appear on the site.

---

## Deploy Hook — Full Guide

The Deploy Hook is a special URL that tells Vercel (your hosting provider) to rebuild the entire site from scratch. Use it when you want your latest Notion changes to go live immediately, without waiting for the hourly sync.

### What is the Deploy Hook URL?

**Save this link somewhere handy (e.g. bookmarks, notes):**

```
https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2
```

Or click: [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2)

### When to use it

- You just set a post to **"Ready for Web"** and want it live now
- You edited text, images, or metadata in Notion and want the changes live
- You added or removed Counterpoint links and want them to appear
- You fixed a typo or changed a slug
- Images look broken — a rebuild re-caches them from Notion

### How to use it

1. Open the Deploy Hook URL in any browser (Chrome, Safari, etc.)
2. You will see a JSON response, e.g. `{"job":{"id":"...","state":"PENDING",...}}`
3. That means Vercel received your request. **You don't need to do anything else.**
4. Wait 2–5 minutes, then refresh your site to see the changes.

### What happens when you click

| Step | What happens |
|------|--------------|
| 1 | Vercel receives the request and starts a new build |
| 2 | The build runs: backup → cache images from Notion → build the site |
| 3 | Fresh data is pulled from Notion at that moment (no waiting for hourly sync) |
| 4 | Images are downloaded and stored locally so they don't expire |
| 5 | The new site is deployed and replaces the old one |

### Common questions

**What am I looking at when I click the link?**  
A page with JSON text like `{"job":{"id":"abc123","state":"PENDING",...}}`. This is normal. It means the build has started. You can close the tab.

**How long until my changes appear?**  
Usually **2–5 minutes**. The build must finish before the new version goes live. If you have Vercel access, you can watch the build in Deployments.

**Can I click it more than once?**  
Yes. Each click starts a new build. If you click again before the previous build finishes, the new one will queue and run after. Avoid clicking many times in a few seconds — once is enough.

**Does it fetch the latest from Notion?**  
Yes. Each build fetches the **latest data from Notion** at that moment. You don't need to wait for any hourly sync.

**Do I need to log in or have a Vercel account?**  
No. The link works for anyone who has it. You don't need to sign in.

**Is it safe to share this link?**  
Anyone with the link can trigger a rebuild. Only share it with people you trust (e.g. yourself, your developer). Don't post it publicly.

---

## Counterpoint — Full Guide

**Counterpoint** lets you link related pieces of content (articles, comics, podcasts) so readers can discover them together. For example, a winery article can link to a related hotel experience, or two essays on the same theme can point to each other.

### What is the Counterpoint field?

In your Notion database, **Counterpoint** is a **Relation** property. It links one page to other pages in the same database. When you add links there, the site shows a 「Counterpoint」 section at the bottom of the article, comic, or podcast page with cards for each linked piece.

### Where does it appear?

- **Article pages** — A "Counterpoint" section appears above "Last updated", with cards for each linked item
- **Comic pages** — Same section at the bottom
- **Podcast pages** — Same section at the bottom

Each card shows: Hero image, title, content type (Article / Comic / Podcast), and a link to that page.

### How to add Counterpoint links in Notion

1. Open the page you want to add links to (e.g. your winery article)
2. Find the **Counterpoint** property (Relation type)
3. Click to add a relation
4. Search for and select the other page(s) you want to link (e.g. a related hotel article)
5. Save the page
6. **Trigger a rebuild** — [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2) — so the links appear on the site

### Requirements for linked pages to appear

| Requirement | Why |
|-------------|-----|
| **Status = "Ready for Web" or "Published"** | Draft or Archived pages are hidden from the site |
| **Same Notion database** | Counterpoint only links to pages in the same database |
| **Rebuild after adding links** | The site fetches Counterpoint data during build — trigger the Deploy Hook |

### If a link doesn't appear

1. **Check the linked page's Status** — It must be "Ready for Web" or "Published"
2. **Trigger a rebuild** — [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2)
3. Wait 2–5 minutes, then refresh the site
4. If still missing, the linked page may be Draft or Archived — change its Status and rebuild again

### Homepage — Category filters

The homepage shows all your content with a **Featured** section (latest entry) and a **grid** below. Click the category buttons (All, Journal, Podcast, Episodes) to filter the content. The filters work on first load and when you navigate back to the homepage from an article. If a filter doesn't respond when you click it, try refreshing the page or clicking the logo to return home first.

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

- Images are now cached locally during build — they should not expire.
- If you see broken images, trigger a fresh rebuild: [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2)
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

### "Counterpoint (Relation) links don't appear on the site"

See the **Counterpoint — Full Guide** section above.

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
| Trigger instant rebuild | Open [Deploy Hook](https://api.vercel.com/v1/integrations/deploy/prj_wcWPd81zPXwkgzlbPD4ZgmIGu6jo/HJhhERlGL2) in your browser |
| Unpublish a post | Set Status = "Archived" or "Draft", then rebuild |
| Fix a typo | Edit in Notion, then rebuild |
| Add sensor data | Fill Lux, Texture, Noise, etc. in Notion, then rebuild |
| Link related articles | Use the Counterpoint (Relation) field in Notion |
| Get help | Contact your developer with: page title, slug, and what you expected |

---

*Protocol Panthera — Built for consistency and AI readiness.*
