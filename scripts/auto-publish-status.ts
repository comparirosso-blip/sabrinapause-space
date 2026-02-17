/**
* Auto-Publish Status Script
* 
* After content is published to the site, automatically updates
* Notion page status from "Ready for Web" to "Published"
*/

import { config } from 'dotenv';
import { Client } from '@notionhq/client';

config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID!;

async function updateStatusToPublished() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Ready for Web',
        },
      },
    });

    for (const page of response.results) {
      if (!('properties' in page)) continue;

      const pageId = page.id;

      await notion.pages.update({
        page_id: pageId,
        properties: {
          Status: {
            select: {
              name: 'Published',
            },
          },
        },
      });
    }
  } catch {
    // Non-critical, don't fail the build
  }
}

// Run the script
updateStatusToPublished();
