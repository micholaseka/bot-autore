
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

const accountManager = new AccountManager();

try {
  // Membaca accounts.json
  accountManager.loadAccounts();

  // Ambil semua akun yang aktif
  const accounts = accountManager.getEnabledAccounts();

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun yang aktif.');
  }

  console.log('================================');
  console.log('       MULTI ACCOUNT TEST');
  console.log('================================');
  console.log(`Total akun aktif: ${accounts.length}`);
  console.log('');

  for (const account of accounts) {
    console.log('--------------------------------');
    console.log(`ID      : ${account.id}`);
    console.log(`Nama    : ${account.name}`);
    console.log(`Profile : ${account.profile}`);
    console.log('--------------------------------');

    const browserManager = new BrowserManager();

    try {
      console.log('Membuka profile...');

      const context =
  await browserManager.launchProfile(account.profile);

      const pages = context.pages();

      const page = pages.length > 0
  ? pages[0]
  : await context.newPage();

    console.log('Membuka Marketplace secara eksplisit...');

     await page.goto(
      'https://www.facebook.com/marketplace/you/dashboard`',
     {
      waitUntil: 'domcontentloaded',
       timeout: 60000
      }
       );

      console.log('URL sekarang:', page.url());

      console.log('Profile berhasil dibuka.');
      console.log('');

      console.log('Silakan periksa Chrome yang terbuka.');
      console.log(`Pastikan akun ${account.name} yang muncul.`);
      console.log('');

      // Beri waktu 5 detik agar kita bisa melihat browser
      await new Promise(resolve =>
        setTimeout(resolve, 5000)
      );

      await browserManager.close();

      console.log('Profile ditutup.');
      console.log('');

    } catch (error) {
      console.error(
        `Gagal membuka ${account.profile}:`
      );

      console.error(error.message);

      try {
        await browserManager.close();
      } catch {
        // Tidak melakukan apa-apa jika browser
        // memang belum berhasil dibuka.
      }
    }
  }

  console.log('================================');
  console.log('       TEST SELESAI');
  console.log('================================');

} catch (error) {
  console.error('');
  console.error('=== MULTI ACCOUNT TEST ERROR ===');
  console.error(error);
}

