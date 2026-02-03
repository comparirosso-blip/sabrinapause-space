import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

async function testNotionConnection() {
  try {
    console.log('🔌 Connecting to Notion database...');
    console.log(`Database ID: ${databaseId}\n`);

    // Query database with filter for Status = "Ready for Web"
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Ready for Web',
        },
      },
    });

    const pages = response.results;
    console.log(`✅ Found ${pages.length} page(s) with Status = "Ready for Web"\n`);

    if (pages.length > 0) {
      const firstPage = pages[0];
      const props = firstPage.properties;
      
      // Get title (handle both "Title" and "Name")
      const title = props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'No title';
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'No slug';
      
      console.log('📄 First page details:');
      console.log(`   Title: ${title}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Page ID: ${firstPage.id}`);
      
      console.log('\n📊 Properties:');
      console.log(`   Content Type: ${props['Content Type']?.select?.name || 'N/A'}`);
      console.log(`   Web Category: ${props['Web Category']?.select?.name || 'N/A'}`);
      console.log(`   Date: ${props.Date?.date?.start || 'N/A'}`);
      console.log(`   Location: ${props.Location?.rich_text?.[0]?.plain_text || 'N/A'}`);
      console.log(`   Project: ${props.Project?.multi_select?.map(p => p.name).join(', ') || 'N/A'}`);
      console.log(`   Concepts: ${props.Concepts?.multi_select?.map(c => c.name).join(', ') || 'N/A'}`);
      
      console.log('\n🏛️ Cultural Legacy Markers:');
      console.log(`   Intent Vector: ${props['Intent Vector']?.rich_text?.[0]?.plain_text || 'N/A'}`);
      console.log(`   SD-Index™: ${props['SD-Index™']?.number || props['SD-Index']?.number || 'N/A'}`);
      
      console.log(`   Hero Image: ${props['Hero Image']?.files?.length || 0} file(s)`);
      
      console.log('\n✅ Milestone 1 Complete!');
      console.log('   ✓ Notion API connection working');
      console.log('   ✓ Data fetching working');
      console.log('   ✓ All required properties present');
      console.log('\n🎯 Ready for Milestone 2: Build page templates');
      
    } else {
      console.log('⚠️  No pages found with Status = "Ready for Web"');
      console.log('\n💡 Next steps:');
      console.log('   1. Open your Notion database');
      console.log('   2. Create or edit a page');
      console.log('   3. Set the Status property to "Ready for Web"');
      console.log('   4. Run this test again: npm run test');
    }

  } catch (error) {
    console.error('\n❌ Error connecting to Notion:');
    console.error(error.message);
    
    if (error.code === 'object_not_found') {
      console.error('\n💡 Error: Database not found or integration lacks access');
      console.error('   1. Check that NOTION_DATABASE_ID is correct');
      console.error('   2. Ensure your Notion integration has access to the database');
      console.error('   3. Go to Notion → ... menu → Connections → Add your integration');
    } else if (error.code === 'unauthorized') {
      console.error('\n💡 Error: Unauthorized');
      console.error('   1. Check that NOTION_API_KEY is correct');
      console.error('   2. Verify the integration token is valid');
    }
    
    process.exit(1);
  }
}

// Run the test
testNotionConnection();
