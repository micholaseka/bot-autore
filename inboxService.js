import { CONFIG } from './config.js';

const UNREAD_SELECTORS = [
  '[aria-label*="unread" i]',
  '[aria-label*="belum dibaca" i]',
  '[data-testid*="unread" i]',
  '[data-testid*="notification" i]'
];

export class InboxService {
  constructor(context) {
    this.context = context;
  }

  async getPage() {
    const pages = this.context.pages();
    return pages.length > 0 ? pages[0] : this.context.newPage();
  }

  async openMarketplaceInbox() {
    const page = await this.getPage();

    await page.goto(CONFIG.marketplace.dashboardUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.phase1.pageTimeoutMs
    });

    await page.waitForTimeout(CONFIG.phase1.settleDelayMs);

    const inboxLink = page.locator('a[href*="/marketplace/inbox/"]').first();
    const linkCount = await page.locator('a[href*="/marketplace/inbox/"]').count();

    if (linkCount === 0) {
      throw new Error('Link inbox Marketplace tidak ditemukan di dashboard.');
    }

    await inboxLink.scrollIntoViewIfNeeded();
    await inboxLink.click();

    await page.waitForTimeout(CONFIG.phase1.settleDelayMs);

    return page;
  }

  async scanUnreadMessages() {
    const page = await this.getPage();

    // Jangan menganggap semua chat sebagai unread.
    // Hanya elemen yang punya sinyal unread yang cukup jelas yang dikembalikan.
    const candidates = await page.locator(
      [
        ...UNREAD_SELECTORS,
        'a[href*="/marketplace/inbox/"]'
      ].join(',')
    ).evaluateAll(elements => {
      const result = [];
      const seen = new Set();

      for (const element of elements) {
        const text = (element.innerText || '').trim();
        const href = element.href || element.getAttribute('href') || '';
        const aria = element.getAttribute('aria-label') || '';
        const testId = element.getAttribute('data-testid') || '';
        const className = typeof element.className === 'string' ? element.className : '';

        const unreadSignal = /unread|belum\s*dibaca/i.test(
          `${aria} ${testId} ${className}`
        );

        const hasInboxHref = /\/marketplace\/inbox\//i.test(href);

        if (!unreadSignal || !hasInboxHref || !text) {
          continue;
        }

        const key = href || text;
        if (seen.has(key)) continue;
        seen.add(key);

        result.push({
          sender: text.split('\n')[0]?.trim() || 'Unknown',
          text,
          href,
          detectedBy: {
            aria,
            testId,
            className
          }
        });
      }

      return result;
    });

    return candidates;
  }

  async inspectPage() {
    const page = await this.getPage();
    return {
      url: page.url(),
      title: await page.title(),
      bodyText: (await page.locator('body').innerText()).slice(0, 15000)
    };
  }
}
