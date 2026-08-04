
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('      CONVERSATION STRUCTURE INSPECTOR');
console.log('========================================');

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // ========================================
  // 1. ACCOUNT
  // ========================================

  console.log('');
  console.log('[1] Membaca accounts.json...');

  accountManager.loadAccounts();

  const accounts =
    accountManager.getEnabledAccounts();

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  const account = accounts[0];

  console.log(`[2] Account : ${account.id}`);
  console.log(`[3] Profile : ${account.profile}`);

  // ========================================
  // 2. OPEN CHROME
  // ========================================

  console.log('');
  console.log('[4] Membuka Chrome...');

  const context =
    await browserManager.launchProfile(account.profile);

  console.log('[5] Chrome berhasil dibuka.');

  // ========================================
  // 3. PAGE
  // ========================================

  const pages = context.pages();

  const page =
    pages.length > 0
      ? pages[0]
      : await context.newPage();

  console.log('[6] Page berhasil didapatkan.');

  // ========================================
  // 4. DASHBOARD
  // ========================================

  console.log('');
  console.log('[7] Membuka Marketplace Dashboard...');

  await page.goto(
      'https://www.facebook.com/marketplace/you/dashboard',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  await page.waitForTimeout(5000);

  console.log('[8] Dashboard siap.');

  // ========================================
  // 5. FIND CHAT LINK
  // ========================================

  console.log('');
  console.log('[9] Mencari Chats to answer...');

  const chatLink =
    page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).first();

  const count =
    await page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).count();

  console.log(`[10] Link ditemukan: ${count}`);

  if (count === 0) {
    throw new Error(
      'Chats to answer tidak ditemukan.'
    );
  }

  // ========================================
  // 6. CLICK CHAT LINK
  // ========================================

  console.log('');
  console.log('[11] Membuka Inbox...');

  await chatLink.scrollIntoViewIfNeeded();

  await chatLink.click();

  await page.waitForTimeout(8000);

  console.log('[12] Inbox terbuka.');

  console.log('');
  console.log('URL:');
  console.log(page.url());

  // ========================================
  // 7. INSPECT LINKS
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('       ELEMENT LINK DI INBOX');
  console.log('========================================');

  const links =
    await page.locator('a').evaluateAll(
      elements =>
        elements
          .map((element, index) => ({
            index,
            text: element.innerText?.trim(),
            href: element.href
          }))
          .filter(item =>
            item.text ||
            item.href
          )
          .slice(0, 150)
    );

  for (const link of links) {
    console.log('');
    console.log(`[LINK ${link.index}]`);
    console.log(`TEXT: ${link.text}`);
    console.log(`HREF: ${link.href}`);
  }

  // ========================================
  // 8. INSPECT BUTTON
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          BUTTON DI INBOX');
  console.log('========================================');

  const buttons =
    await page.locator('button').evaluateAll(
      elements =>
        elements
          .map((element, index) => ({
            index,
            text: element.innerText?.trim(),
            aria:
              element.getAttribute('aria-label'),
            title:
              element.getAttribute('title')
          }))
          .filter(item =>
            item.text ||
            item.aria ||
            item.title
          )
          .slice(0, 150)
    );

  for (const button of buttons) {
    console.log('');
    console.log(`[BUTTON ${button.index}]`);
    console.log(`TEXT : ${button.text}`);
    console.log(`ARIA : ${button.aria}`);
    console.log(`TITLE: ${button.title}`);
  }

  // ========================================
  // 9. INSPECT ROLE LISTITEM
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          LISTITEM DI INBOX');
  console.log('========================================');

  const listItems =
    await page.locator(
      '[role="listitem"]'
    ).evaluateAll(
      elements =>
        elements
          .map((element, index) => ({
            index,
            text: element.innerText?.trim()
          }))
          .filter(item => item.text)
          .slice(0, 100)
    );

  for (const item of listItems) {
    console.log('');
    console.log(`[LISTITEM ${item.index}]`);
    console.log(item.text);
  }

  // ========================================
  // 10. INSPECT POSSIBLE ROWS
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('        POSSIBLE CONVERSATION ROWS');
  console.log('========================================');

  const rows =
    await page.locator(
      '[role="row"]'
    ).evaluateAll(
      elements =>
        elements
          .map((element, index) => ({
            index,
            text: element.innerText?.trim()
          }))
          .filter(item => item.text)
          .slice(0, 100)
    );

  for (const row of rows) {
    console.log('');
    console.log(`[ROW ${row.index}]`);
    console.log(row.text);
  }

  // ========================================
  // 11. FINISH
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('             INSPEKSI SELESAI');
  console.log('========================================');

  console.log('');
  console.log('Browser dibiarkan terbuka.');
  console.log('Tekan Ctrl + C untuk menghentikan.');

} catch (error) {

  console.log('');
  console.log('========================================');
  console.log('                ERROR');
  console.log('========================================');

  console.error(error);
}
