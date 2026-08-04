
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';
import { InboxService } from './inboxService.js';

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {
  // Membaca akun
  accountManager.loadAccounts();

  // Ambil akun aktif
  const accounts =
    accountManager.getEnabledAccounts();

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  // Untuk tahap pertama hanya gunakan akun pertama
  const account = accounts[0];

  console.log('================================');
  console.log('       INBOX INSPECTOR');
  console.log('================================');

  console.log(`Akun    : ${account.name}`);
  console.log(`Profile : ${account.profile}`);

  console.log('');
  console.log('Membuka browser...');

  const context =
    await browserManager.launchProfile(account.profile);

  console.log('Browser berhasil dibuka.');

  // Buat Inbox Service
  const inboxService =
    new InboxService(context);

  // Baca isi halaman
  await inboxService.inspectMarketplacePage();

  console.log('');
  console.log('Browser dibiarkan terbuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');

} catch (error) {
  console.error('');
  console.error('=== ERROR ===');
  console.error(error);
}
