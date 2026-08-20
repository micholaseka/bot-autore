import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { CONFIG } from './config.js';

export class BrowserManager {
  constructor() {
    this.context = null;
    this.accountId = null;
    this.profilePath = null;
  }

  resolveProfilePath(profile) {
    const raw = String(profile);

    // Absolute path: gunakan langsung.
    if (path.isAbsolute(raw)) {
      return raw;
    }

    // Relative path: berada di bawah profiles/.
    return path.resolve(CONFIG.chrome.profilesRoot, raw);
  }

  async launchProfile(account) {
    if (this.context) {
      throw new Error(`Browser masih aktif untuk akun ${this.accountId}.`);
    }

    const profilePath = this.resolveProfilePath(account.profile);
    fs.mkdirSync(profilePath, { recursive: true });

    const launchOptions = {
      headless: false,
      timeout: 60000
    };

    if (CONFIG.chrome.executablePath) {
      launchOptions.executablePath = CONFIG.chrome.executablePath;
    }

    console.log('=== BROWSER MANAGER ===');
    console.log(`Account : ${account.id}`);
    console.log(`Profile : ${profilePath}`);

    this.context = await chromium.launchPersistentContext(profilePath, launchOptions);
    this.accountId = account.id;
    this.profilePath = profilePath;

    console.log('Browser profile berhasil dibuka.');
    return this.context;
  }

  getContext() {
    if (!this.context) {
      throw new Error('Browser belum berjalan.');
    }
    return this.context;
  }

  async close() {
    if (!this.context) {
      return;
    }

    try {
      await this.context.close();
    } finally {
      this.context = null;
      this.accountId = null;
      this.profilePath = null;
    }

    console.log('Browser ditutup.');
  }
}
