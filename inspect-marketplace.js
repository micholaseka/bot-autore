
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('     MARKETPLACE DASHBOARD INSPECTOR');
console.log('========================================');

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // ========================================
  // 1. BACA ACCOUNT
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

  // Untuk sementara hanya Profile 1
  const account = accounts[0];

  console.log('');
  console.log('[3] Akun yang digunakan');
  console.log(`    ID      : ${account.id}`);
  console.log(`    Nama    : ${account.name}`);
  console.log(`    Profile : ${account.profile}`);

  // ========================================
  // 2. BUKA CHROME
  // ========================================

  console.log('');
  console.log('[4] Membuka Chrome Portable...');

  const context =
    await browserManager.launchProfile(account.profile);

  console.log('[5] Chrome berhasil dibuka.');

  // ========================================
  // 3. AMBIL TAB
  // ========================================

  const pages = context.pages();

  console.log(`[6] Jumlah tab: ${pages.length}`);

  const page = pages.length > 0
    ? pages[0]
    : await context.newPage();

  console.log('[7] Tab berhasil didapatkan.');

  // ========================================
  // 4. BUKA DASHBOARD
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

  console.log('[9] Navigasi selesai.');

  // ========================================
  // 5. TUNGGU FACEBOOK
  // ========================================

  console.log('');
  console.log('[10] Menunggu halaman 8 detik...');

  await page.waitForTimeout(8000);

  // ========================================
  // 6. INFORMASI DASAR
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          INFORMASI HALAMAN');
  console.log('========================================');

  console.log('');
  console.log('URL:');
  console.log(page.url());

  console.log('');
  console.log('TITLE:');

  const title = await page.title();
  console.log(title);

  // ========================================
  // 7. AMBIL TEXT HALAMAN
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          TEXT HALAMAN');
  console.log('========================================');

  const bodyText =
    await page.locator('body').innerText({
      timeout: 30000
    });

  console.log('');
  console.log(bodyText.substring(0, 20000));

  // ========================================
  // 8. CARI KATA KUNCI INBOX
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('        PENCARIAN KATA KUNCI');
  console.log('========================================');

  const keywords = [
    'Pesan',
    'Messages',
    'Message',
    'Inbox',
    'Kotak Masuk',
    'Marketplace'
  ];

  for (const keyword of keywords) {
    const count =
      await page
        .getByText(keyword, { exact: false })
        .count();

    console.log(`${keyword}: ${count} elemen`);
  }

  // ========================================
  // 9. CARI LINK
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          LINK YANG TERDETEKSI');
  console.log('========================================');

  const links = await page.locator('a').evaluateAll(
    elements =>
      elements
        .map(element => ({
          text: element.innerText?.trim(),
          href: element.href
        }))
        .filter(item => item.text || item.href)
        .slice(0, 100)
  );

  for (const link of links) {
    console.log('');
    console.log(`TEXT : ${link.text}`);
    console.log(`HREF : ${link.href}`);
  }

  // ========================================
  // 10. SELESAI
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          INSPECTION SELESAI');
  console.log('========================================');

  console.log('');
  console.log('Browser dibiarkan terbuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {

  console.log('');
  console.log('========================================');
  console.log('              ERROR');
  console.log('========================================');

  console.error(error);
}