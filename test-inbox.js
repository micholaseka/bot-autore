
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('       MARKETPLACE INBOX CLICK TEST');
console.log('========================================');

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // ========================================
  // 1. LOAD ACCOUNT
  // ========================================

  console.log('');
  console.log('[1] Membaca accounts.json...');

  accountManager.loadAccounts();

  const accounts =
    accountManager.getEnabledAccounts();

  console.log(`[2] Akun aktif: ${accounts.length}`);

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  const account = accounts[0];

  console.log('');
  console.log('[3] Akun yang digunakan:');
  console.log(`    ID      : ${account.id}`);
  console.log(`    Nama    : ${account.name}`);
  console.log(`    Profile : ${account.profile}`);

  // ========================================
  // 2. OPEN CHROME
  // ========================================

  console.log('');
  console.log('[4] Membuka Chrome Portable...');

  const context =
    await browserManager.launchProfile(account.profile);

  console.log('[5] Chrome berhasil dibuka.');

  // ========================================
  // 3. GET PAGE
  // ========================================

  let pages = context.pages();

  console.log(`[6] Jumlah tab: ${pages.length}`);

  const page = pages.length > 0
    ? pages[0]
    : await context.newPage();

  console.log('[7] Tab berhasil didapatkan.');

  // ========================================
  // 4. OPEN MARKETPLACE DASHBOARD
  // ========================================

  console.log('');
  console.log('[8] Membuka Marketplace Dashboard...');

  await page.goto(
      'https://www.facebook.com/marketplace/you/dashboard',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  console.log('[9] Dashboard berhasil dibuka.');

  // ========================================
  // 5. WAIT
  // ========================================

  console.log('');
  console.log('[10] Menunggu Dashboard 8 detik...');

  await page.waitForTimeout(8000);

  console.log('');
  console.log('URL Dashboard:');
  console.log(page.url());

  // ========================================
  // 6. CARI "CHATS TO ANSWER"
  // ========================================

  console.log('');
  console.log('[11] Mencari "Chats to answer"...');

  const chatLinks =
    page.locator(
      'a[href*="/marketplace/inbox/"]'
    );

  const count =
    await chatLinks.count();

  console.log(`[12] Link Inbox ditemukan: ${count}`);

  if (count === 0) {
    throw new Error(
      'Link Marketplace Inbox tidak ditemukan di Dashboard.'
    );
  }

  // ========================================
  // 7. AMBIL ELEMEN PERTAMA
  // ========================================

  const chatLink =
    chatLinks.first();

  console.log('');
  console.log('[13] Informasi elemen Inbox:');

  console.log(
    'TEXT:',
    await chatLink.innerText()
  );

  console.log(
    'HREF:',
    await chatLink.getAttribute('href')
  );

  // ========================================
  // 8. SCROLL KE ELEMENT
  // ========================================

  console.log('');
  console.log('[14] Scroll ke Chats to answer...');

  await chatLink.scrollIntoViewIfNeeded();

  await page.waitForTimeout(1000);

  // ========================================
  // 9. CLICK
  // ========================================

  console.log('');
  console.log('[15] Klik Chats to answer...');

  await chatLink.click({
    timeout: 30000
  });

  console.log('[16] Klik berhasil.');

  // ========================================
  // 10. TUNGGU NAVIGASI
  // ========================================

  console.log('');
  console.log('[17] Menunggu perubahan halaman...');

  await page.waitForTimeout(8000);

console.log('');
console.log('========================================');
console.log('          INSPECT MARKETPLACE INBOX');
console.log('========================================');

console.log('');
console.log('[19] URL Inbox:');
console.log(page.url());

console.log('');
console.log('[20] Title Inbox:');

const inboxTitle = await page.title();

console.log(inboxTitle);

console.log('');
console.log('[21] Membaca teks Inbox...');

const inboxText =
  await page.locator('body').innerText({
    timeout: 30000
  });

console.log('');
console.log('========================================');
console.log('              INBOX TEXT');
console.log('========================================');

console.log(
  inboxText.substring(0, 30000)
);

console.log('');
console.log('========================================');
console.log('          INSPECTION SELESAI');
console.log('========================================');

console.log('');
console.log('Browser dibiarkan terbuka.');
console.log('Tekan Ctrl + C untuk menghentikan test.');



  // ========================================
  // 11. CEK TAB
  // ========================================

  pages = context.pages();

  console.log('');
  console.log(`[18] Jumlah tab sekarang: ${pages.length}`);

  for (let i = 0; i < pages.length; i++) {
    console.log(`Tab ${i + 1}: ${pages[i].url()}`);
  }

  // ========================================
  // 12. INFO PAGE
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('             HASIL INBOX');
  console.log('========================================');

  console.log('');
  console.log('URL sekarang:');
  console.log(page.url());

  console.log('');
  console.log('TITLE:');

  console.log(
    await page.title()
  );

  // ========================================
  // 13. BACA TEXT
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('              INBOX TEXT');
  console.log('========================================');

  const bodyText =
    await page.locator('body').innerText({
      timeout: 30000
    });

  console.log(
    bodyText.substring(0, 20000)
  );

  // ========================================
  // 14. SELESAI
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          TEST INBOX SELESAI');
  console.log('========================================');

  console.log('');
  console.log('Browser dibiarkan terbuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {

  console.log('');
  console.log('========================================');
  console.log('                ERROR');
  console.log('========================================');

  console.error(error);
}

