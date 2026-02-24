/**
 * Generate backup script
 * Run this during build to save all Notion data to /data/backup/
 */

import { NotionLoader } from '../src/lib/notion-loader';
import { BackupSystem } from '../src/lib/backup-system';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function generateBackup() {
  try {
    const loader = new NotionLoader(
      process.env.NOTION_API_KEY!,
      process.env.NOTION_DATABASE_ID!,
      { cacheImages: true }
    );

    const content = await loader.getAll();
    const backup = new BackupSystem();
    await backup.performFullBackup(content);

    const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';
    const isSyncMode = process.env.SYNC_MODE === 'true';

    if (!isCI || isSyncMode) {
      await autoCommitBackup();
    }
  } catch {
    process.exit(1);
  }
}

/**
 * Auto-commit and push backup files to GitHub
 */
async function autoCommitBackup() {
  const { execSync } = await import('child_process');

  try {
    const date = new Date().toISOString().split('T')[0];
    execSync('git add data/backup/', { stdio: 'pipe' });
    execSync(`git commit -m "[AUTO] Backup: Notion content snapshot ${date}"`, { stdio: 'pipe' });
    execSync('git push', { stdio: 'inherit' });
  } catch (_error: unknown) {
    // Ignore (nothing to commit, or push failed)
  }
}

// Run backup
generateBackup();
