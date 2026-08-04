
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('================================');
console.log('       TEST MARKETPLACE PAGE');
console.log('================================');

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // ========================================
  // 1. BACA ACCOUNT
  // ========================================

  console.log('');
  console.log('1. Membaca accounts.json...');

  accountManager.loadAccounts();

  const accounts =
    accountManager.getEnabledAccounts();

  console.log(`2. Jumlah akun aktif: ${accounts.length}`);

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  // Gunakan akun aktif pertama
  const account = accounts[0];

  console.log('');
  console.log('3. Akun yang digunakan:');
  console.log(`   ID      : ${account.id}`);
  console.log(`   Nama    : ${account.name}`);
  console.log(`   Profile : ${account.profile}`);

  // ========================================
  // 2. BUKA CHROME
  // ========================================

  console.log('');
  console.log('4. Membuka Chrome Portable...');

  const context =
    await browserManager.launchProfile(account.profile);

  console.log('5. Chrome berhasil dibuka.');

  // ========================================
  // 3. AMBIL TAB
  // ========================================

  const pages = context.pages();

  console.log(`6. Jumlah tab: ${pages.length}`);

  const page = pages.length > 0
    ? pages[0]
    : await context.newPage();

  console.log('7. Tab berhasil didapatkan.');

  console.log('');
  console.log('URL sebelum navigasi:');
  console.log(page.url());

  // ========================================
  // 4. BUKA MARKETPLACE DASHBOARD
  // ========================================

  console.log('');
  console.log('8. Membuka Marketplace Dashboard...');

  await page.goto(
   'https://www.facebook.com/marketplace/you/dashboard',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  console.log('9. Navigasi selesai.');

  // ========================================
  // 5. TUNGGU HALAMAN
  // ========================================

  console.log('');
  console.log('10. Menunggu halaman 10 detik...');

  await page.waitForTimeout(10000);

  // ========================================
  // 6. INFORMASI HALAMAN
  // ========================================

  console.log('');
  console.log('================================');
  console.log('       HASIL TEST');
  console.log('================================');

  console.log('');
  console.log('URL sekarang:');
  console.log(page.url());

  console.log('');
  console.log('TITLE:');

  const title = await page.title();

  console.log(title);

  console.log('');
  console.log('================================');
  console.log('MARKETPLACE DASHBOARD TERBUKA');
  console.log('================================');

  console.log('');
  console.log('Browser sengaja dibiarkan terbuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {

  console.log('');
  console.log('================================');
  console.log('          TEST ERROR');
  console.log('================================');

  console.error(error);

  try {
    await browserManager.close();
  } catch {
    // Browser mungkin belum berhasil dibuka.
  }
}
