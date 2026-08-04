import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';
import { FacebookService } from './facebookService.js';

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // Membaca daftar akun
  accountManager.loadAccounts();

  // Mengambil akun aktif
  const enabledAccounts =
    accountManager.getEnabledAccounts();

  if (enabledAccounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  // Gunakan akun aktif pertama
  const account = enabledAccounts[0];

  console.log('=== ACCOUNT ===');
  console.log(`ID      : ${account.id}`);
  console.log(`Nama    : ${account.name}`);
  console.log(`Profile : ${account.profile}`);

  // Buka Chrome menggunakan profile akun
  const context =
    await browserManager.launchProfile(account.profile);

  // Buat Facebook Service
  const facebookService =
    new FacebookService(context);

  // Buka Marketplace
  const page =
    await facebookService.openMarketplaceDashboard();

  console.log('');
  console.log('=== FACEBOOK ===');
  console.log(`URL: ${page.url()}`);

  console.log('');
  console.log('Facebook Marketplace berhasil dibuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {
  console.error('');
  console.error('=== ERROR ===');
  console.error(error);
}
