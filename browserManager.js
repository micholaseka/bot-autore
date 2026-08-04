import { chromium } from 'playwright';
import { CONFIG } from './config.js';

export class BrowserManager {
  constructor() {
    this.context = null;
  }

  async launchProfile(profileName) {
    if (this.context) {
      throw new Error('Browser sudah berjalan.');
    }

    const profilePath = profileName;

    console.log('=== BROWSER MANAGER ===');
    console.log('Chrome:', CONFIG.chrome.executablePath);
    console.log('User Data:', CONFIG.chrome.userDataDir);
    console.log('Profile:', profilePath);

    this.context = await chromium.launchPersistentContext(
      CONFIG.chrome.userDataDir,
      {
        executablePath: CONFIG.chrome.executablePath,
        headless: false,
        args: [
          `--profile-directory=${profilePath}`
        ]
      }
    );

    console.log('Chrome berhasil dibuka.');

    return this.context;
  }

  async close() {
    if (!this.context) {
      return;
    }

    await this.context.close();
    this.context = null;

    console.log('Chrome ditutup.');
  }
}