/**
 * Check current Notion database schema vs M3 requirements
 * Run: npx tsx scripts/check-notion-schema.ts
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const M3_REQUIRED = {
  PTV_Raw: { type: 'rich_text', desc: 'Text: 0.5,0.5,0.5,0.5,0.5' },
  sdIndex_Raw: { type: 'rich_text', desc: 'Text: 0.5,0.5,0.5' },
  Region_Cluster: { type: 'select', desc: 'Select: Japan, Germany, Portugal, Other' },
  Counterpoint: { type: 'relation', desc: 'Relation (self-relation)' },
  Evidence_Type: { type: 'multi_select', desc: 'Multi-select: Field, Interview, Comparative, Lab' },
  Confidence: { type: 'select', desc: 'Select: High, Medium, Low' },
  Coordinates: { type: 'rich_text', desc: 'Text: GPS data' },
  Altitude: { type: 'number', desc: 'Number: meters' },
} as const;

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error('Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env');
    process.exit(1);
  }

  const notion = new Client({ auth: apiKey });

  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const props = (db as any).properties || {};
    const existing = Object.keys(props);

    console.log('\n=== Current Notion Database Properties ===\n');
    for (const [name, schema] of Object.entries(props)) {
      const s = schema as any;
      const type = s.type || '?';
      const opts = s[type] ? JSON.stringify(s[type]).slice(0, 60) : '';
      console.log(`  ${name}: ${type} ${opts ? `(${opts}...)` : ''}`);
    }

    console.log('\n=== M3 Required Properties ===\n');
    const missing: string[] = [];
    for (const [name, req] of Object.entries(M3_REQUIRED)) {
      const has = existing.includes(name);
      const status = has ? '✓ EXISTS' : '✗ MISSING';
      console.log(`  ${status}  ${name}`);
      console.log(`         → ${(req as any).type}: ${(req as any).desc}`);
      if (!has) missing.push(name);
    }

    if (missing.length > 0) {
      console.log('\n--- Properties to add in Notion ---');
      missing.forEach((name) => console.log(`  • ${name}`));
    } else {
      console.log('\n✓ All M3 properties exist.');
    }
    console.log('');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
