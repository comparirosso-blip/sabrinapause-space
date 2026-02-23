/**
 * Thorough validation of Notion properties and data sync pipeline
 * Run during/after winery visits to verify sensor data flows correctly
 *
 * Usage: npm run test:sync
 * Requires: .env with NOTION_API_KEY and NOTION_DATABASE_ID
 */

import { Client } from '@notionhq/client';
import { NotionLoader } from '../src/lib/notion-loader';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// =============================================================================
// PHASE 1: Notion Database Schema Verification
// =============================================================================

async function verifyDatabaseSchema() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 PHASE 1: NOTION DATABASE SCHEMA');
  console.log('='.repeat(60));

  const db = await notion.databases.retrieve({ database_id: databaseId });
  const props = db.properties;

  const requiredProps = ['Title', 'Status', 'Slug', 'Content Type', 'Web Category', 'Date', 'Location', 'Hero Image'];
  const optionalProps = ['Project', 'Concepts', 'Intent Vector', 'SD-Index™', 'Intent_Marker', 'Lux', 'Texture', 'Noise', 'Space Pattern', 'Time Velocity'];

  let schemaOk = true;
  console.log('\nREQUIRED properties:');
  for (const name of requiredProps) {
    const prop = props[name];
    const exists = !!prop;
    const type = prop?.type || 'MISSING';
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${name}: ${type}`);
    if (!exists) schemaOk = false;
  }
  console.log('\nOPTIONAL (sensors / M2):');
  for (const name of optionalProps) {
    const prop = props[name];
    const exists = !!prop;
    const type = prop?.type || 'MISSING';
    const status = exists ? '✅' : '⚪';
    console.log(`   ${status} ${name}: ${type}`);
  }

  console.log('\n📊 SENSOR DETAILS (for winery/terroir content):');
  for (const name of ['Lux', 'Texture', 'Noise', 'Space Pattern', 'Time Velocity']) {
    const prop = props[name];
    if (prop) {
      const extra = prop.type === 'multi_select' ? ` (${prop.multi_select?.length || 0} options)` : '';
      console.log(`   ${name}: ${prop.type}${extra}`);
    }
  }

  return schemaOk;
}

// =============================================================================
// PHASE 2: Raw Notion Data (Published Content)
// =============================================================================

async function verifyRawNotionData() {
  console.log('\n' + '='.repeat(60));
  console.log('📥 PHASE 2: RAW NOTION DATA (Published Content)');
  console.log('='.repeat(60));

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        { property: 'Status', select: { equals: 'Ready for Web' } },
        { property: 'Status', select: { equals: 'Published' } },
      ],
    },
  });

  const pages = response.results;
  console.log(`\nFound ${pages.length} published page(s)\n`);

  if (pages.length === 0) {
    console.log('⚠️  No pages with Status = "Ready for Web" or "Published"');
    return false;
  }

  for (const page of pages) {
    const props = page.properties;

    const getTitle = () => props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'No title';
    const getSlug = () => props.Slug?.rich_text?.[0]?.plain_text || 'no-slug';
    const getSelect = (name) => props[name]?.select?.name || '-';
    const getMultiSelect = (name) => props[name]?.multi_select?.map(m => m.name).join(', ') || '-';
    const getRichText = (name) => props[name]?.rich_text?.[0]?.plain_text || '-';
    const getNumber = (name) => props[name]?.number ?? props[name]?.formula?.number ?? '-';
    const getDate = () => props.Date?.date?.start || '-';

    console.log(`📄 "${getTitle()}" (${getSlug()})`);
    console.log('   Core:');
    console.log(`      Content Type: ${getSelect('Content Type')}`);
    console.log(`      Web Category: ${getSelect('Web Category')}`);
    console.log(`      Date: ${getDate()}`);
    console.log(`      Location: ${getRichText('Location')}`);
    console.log(`      Project: ${getMultiSelect('Project')}`);
    console.log(`      Concepts: ${getMultiSelect('Concepts')}`);
    console.log('   Cultural Legacy:');
    console.log(`      Intent Vector: ${getMultiSelect('Intent Vector')}`);
    console.log(`      Intent_Marker: ${getMultiSelect('Intent_Marker')}`);
    console.log(`      SD-Index™: ${getNumber('SD-Index™')}`);
    console.log('   Sensor Fields (for winery/terroir):');
    console.log(`      Lux: ${getNumber('Lux')}`);
    console.log(`      Texture: ${getSelect('Texture')}`);
    console.log(`      Noise: ${getMultiSelect('Noise')}`);
    console.log(`      Space Pattern: ${getRichText('Space Pattern')}`);
    console.log(`      Time Velocity: ${getNumber('Time Velocity')}`);
    console.log(`      Hero Image: ${props['Hero Image']?.files?.length ? '✅ present' : '-'}`);
    console.log('');
  }

  return true;
}

// =============================================================================
// PHASE 3: Transformed Pipeline (NotionLoader → Content)
// =============================================================================

async function verifyTransformedPipeline() {
  console.log('\n' + '='.repeat(60));
  console.log('🔄 PHASE 3: TRANSFORMED PIPELINE');
  console.log('='.repeat(60));

  const loader = new NotionLoader(
    process.env.NOTION_API_KEY,
    process.env.NOTION_DATABASE_ID,
    { cacheImages: false }
  );

  const content = await loader.getAll();
  console.log(`\nLoaded ${content.length} content item(s) via NotionLoader\n`);

  const checks = {
    hasContent: content.length > 0,
    allHaveSlug: content.every(c => c.slug),
    allHaveTitle: content.every(c => c.title),
    intentVectorIsArray: content.every(c => Array.isArray(c.intentVector)),
    Intent_MarkerIsArray: content.every(c => Array.isArray(c.Intent_Marker)),
    noiseIsArray: content.every(c => Array.isArray(c.noise)),
    sdIndexNumber: content.every(c => typeof c.sdIndex === 'number'),
    sensorFieldsPresent: content.every(c =>
      'lux' in c && 'texture' in c && 'noise' in c && 'spacePattern' in c && 'timeVelocity' in c
    ),
  };

  console.log('Validation:');
  for (const [name, ok] of Object.entries(checks)) {
    console.log(`   ${ok ? '✅' : '❌'} ${name}`);
  }

  // Sample output for first item
  if (content.length > 0) {
    const sample = content[0];
    console.log('\n📤 Sample transformed output (first item):');
    console.log(JSON.stringify({
      title: sample.title,
      slug: sample.slug,
      contentType: sample.contentType,
      intentVector: sample.intentVector,
      Intent_Marker: sample.Intent_Marker,
      sdIndex: sample.sdIndex,
      lux: sample.lux,
      texture: sample.texture,
      noise: sample.noise,
      spacePattern: sample.spacePattern,
      timeVelocity: sample.timeVelocity,
    }, null, 2));
  }

  return Object.values(checks).every(Boolean);
}

// =============================================================================
// PHASE 4: API Endpoint (if dev server running)
// =============================================================================

async function verifyApiEndpoint() {
  console.log('\n' + '='.repeat(60));
  console.log('🌐 PHASE 4: API ENDPOINT (optional)');
  console.log('='.repeat(60));

  try {
    const res = await fetch('http://localhost:4321/api/experiences.json');
    if (!res.ok) {
      console.log('\n⚠️  Dev server not running or API unavailable');
      console.log('   Start with: npm run dev');
      console.log('   Then re-run this test for full validation');
      return null;
    }

    const data = await res.json();
    console.log(`\n✅ API returned ${data.count} items`);
    if (data.data?.length > 0) {
      const first = data.data[0];
      console.log(`   Sample: "${first.title}" - lux=${first.lux}, texture="${first.texture}", noise=${JSON.stringify(first.noise)}`);
    }
    return true;
  } catch (e) {
    console.log('\n⚠️  Could not reach API (is npm run dev active?)');
    return null;
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function run() {
  console.log('\n🍷 SABRINA\'S PAUSE — Data Sync Validation');
  console.log('   Testing Notion properties and pipeline for winery/terroir content\n');

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error('❌ Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env');
    process.exit(1);
  }

  try {
    const schemaOk = await verifyDatabaseSchema();
    const rawOk = await verifyRawNotionData();
    const pipelineOk = await verifyTransformedPipeline();
    const apiOk = await verifyApiEndpoint();

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`   Schema:   ${schemaOk ? '✅' : '❌'}`);
    console.log(`   Raw Data: ${rawOk ? '✅' : '❌'}`);
    console.log(`   Pipeline: ${pipelineOk ? '✅' : '❌'}`);
    console.log(`   API:      ${apiOk === true ? '✅' : apiOk === null ? '⏭️ skipped' : '❌'}`);
    console.log('');

    // Pipeline success = data sync works. Schema failures are advisory (add props in Notion when ready).
    const success = rawOk && pipelineOk;
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

run();
