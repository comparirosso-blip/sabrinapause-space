/**
 * Diagnostic: Verify Counterpoint data is being fetched from Notion
 * Run: npx tsx scripts/check-counterpoint.ts
 */

import dotenv from 'dotenv';
import { NotionLoader } from '../src/lib/notion-loader';

dotenv.config();

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error('Missing NOTION_API_KEY or NOTION_DATABASE_ID');
    process.exit(1);
  }

  const loader = new NotionLoader(apiKey, databaseId, { cacheImages: true });
  const all = await loader.getAll();

  console.log('\n=== Counterpoint Diagnostic ===\n');

  const withCounterpoint = all.filter((c) => c.counterpointIds?.length > 0);
  if (withCounterpoint.length === 0) {
    console.log('No content has Counterpoint links in Notion.');
    console.log('Check: 1) Property name is exactly "Counterpoint" (relation type)');
    console.log('      2) You have linked pages in the Counterpoint field');
    console.log('      3) Linked pages have Status "Ready for Web" or "Published"\n');
    return;
  }

  for (const c of withCounterpoint) {
    console.log(`\n${c.contentType}/${c.slug}:`);
    console.log(`  counterpointIds: ${c.counterpointIds?.join(', ')}`);

    const counterpointItems = await loader.getByPageIds(c.counterpointIds || []);
    console.log(`  Resolved: ${counterpointItems.length} of ${c.counterpointIds?.length} linked`);

    counterpointItems.forEach((item, i) => {
      console.log(`    - ${item.contentType}/${item.slug}: "${item.title}"`);
    });

    if (counterpointItems.length < (c.counterpointIds?.length || 0)) {
      const missing = (c.counterpointIds || []).filter(
        (id) => !counterpointItems.some((item) => item.id === id)
      );
      console.log(`  ⚠ Missing (likely Draft/Archived): ${missing.join(', ')}`);
    }
  }

  console.log('\n');
}

main().catch(console.error);
