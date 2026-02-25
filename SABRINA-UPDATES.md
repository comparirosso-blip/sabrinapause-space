# Sabrina's Pause — Client Updates & Briefings

---

## Update — Styling & Data Layer (Feb 2025)

### Technical Response — Data Layer

#### 1. JSON Schema / TypeScript Interface

**Location:** `src/types.ts`, `src/pages/api/schemas.json`

| Field | Type | Notes |
|-------|------|-------|
| **PTV_Raw** | Parsed → `ptv: number[]` | 5-element array: [Geometry, Lightness, Restraint, Tension, Earthiness]. Stored as comma-separated string in Notion, parsed to `number[]` in `transformers.ts`. |
| **Altitude** | `altitude: number \| null` | Typed as `number \| null`. Empty in Notion → `null` (see Error Handling below). |
| **Counterpoint** | `counterpointIds: string[]` | Array of Notion page IDs. Not nested objects—IDs are resolved at render time via `getByPageIds()` into full Content objects for the cards. Schema: `{ type: 'array', items: 'string' }`. |

**Schema endpoint:** `GET /api/schemas.json` returns the full JSON schema for all content types.

---

#### 2. Data Fetching

**Yes — build-time fetch.** The frontend does **not** call a JSON API at runtime. Data flow:

1. **Build time:** `NotionLoader` (in `src/lib/notion-loader.ts`) fetches directly from the Notion API.
2. **Transform:** Each Notion page is transformed into a typed `Content` object (ArticleContent, ComicContent, PodcastContent) via `transformers.ts`.
3. **Static output:** Astro generates static HTML. Content is **distinct typed objects** (with `id`, `slug`, `blocks`, `location`, etc.), not static text blocks.
4. **Optional JSON API:** `/api/experiences.json` and `/api/experiences/[slug].json` expose the same data as JSON for external consumers (e.g. Dolphin).

---

#### 3. SEO & Social (OG Tags)

| Tag | Source | Status |
|-----|--------|--------|
| **og:title** | Passed from each page → Layout | ✅ Mapped from Notion (content.title) |
| **og:description** | Passed from each page → Layout | ✅ Mapped from Notion (intentVector or excerpt) |
| **og:image** | Layout | ⚠️ Currently uses static `/og-image.png`. Per-page hero images are **not** yet used for og:image. Can be updated to use `content.heroImage` per page. |

**Recommendation:** Add `preloadImage` / `ogImage` prop to Layout and pass `content.heroImage` from article/comic/podcast pages for per-page social previews.

---

#### 4. Error Handling — Empty Fields

**Altitude (and similar optional fields):**

```ts
// transformers.ts
const altitude = props.Altitude ? extractNumber(props.Altitude) : null;
```

- **Empty/missing in Notion** → `null` (not `0`, not `undefined`).
- **extractNumber** uses `prop?.number ?? 0` internally, but we guard with `props.Altitude ?` so missing → `null`.
- Build does **not** break. All optional M3 fields (lux, texture, altitude, coordinates, etc.) have `| null` or `|| []` fallbacks.

---

#### 5. Language Support

**Yes — schema is ready.** `src/types.ts` defines:

```ts
language: 'zh' | 'en';
```

- Currently defaulted to `'en'` in transformers (line 109).
- To support Chinese: add a `Language` or `Locale` property in Notion and map it in `transformers.ts`. The schema and types already support it.

---

## Crawler Blocking (Do Not Index Yet)

Per Sabrina's request: **Do NOT submit the sitemap to search engines or indexers yet.** Building content base first before inviting global LLM crawlers.

**Currently in place:**
- `noindex, nofollow` meta tag in `Layout.astro` — tells search engines and AI not to index
- `robots.txt` with `Disallow: /` — asks crawlers not to fetch any pages
- Sitemap is **not** listed in robots.txt (do not submit to Google Search Console or Bing Webmaster Tools)

**When ready to go live:**
1. Remove the `<meta name="robots" content="noindex, nofollow" />` line from `src/layouts/Layout.astro`
2. Update `public/robots.txt` to `Allow: /` and add the Sitemap line
3. Submit sitemap to Google Search Console and Bing Webmaster Tools (optional)

---

*Last updated: Feb 2025*
