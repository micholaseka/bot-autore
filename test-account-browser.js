import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // 1. Baca daftar akun
  accountManager.loadAccounts();

  // 2. Ambil akun yang aktif
  const enabledAccounts =
    accountManager.getEnabledAccounts();

  if (enabledAccounts.length === 0) {
    throw new Error('Tidak ada akun yang aktif.');
  }

  // 3. Untuk test pertama, kita gunakan akun aktif pertama
  const account = enabledAccounts[0];

  console.log('=== ACCOUNT ===');
  console.log(`ID      : ${account.id}`);
  console.log(`Nama    : ${account.name}`);
  console.log(`Profile : ${account.profile}`);

  console.log('');
  console.log('Membuka browser...');

  // 4. Buka profile Chrome berdasarkan accounts.json
  await browserManager.launchProfile(account.profile);

  console.log('');
  console.log('=== BERHASIL ===');
  console.log(`Akun ${account.id} menggunakan ${account.profile}`);
  console.log('Chrome berhasil dibuka.');

  console.log('');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {
  console.error('');
  console.error('=== ERROR ===');
  console.error(error.message);
}
