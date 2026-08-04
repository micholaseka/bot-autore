import { AccountManager } from './accountManager.js';

const accountManager = new AccountManager();

try {
  const accounts = accountManager.loadAccounts();

  console.log('=== SEMUA AKUN ===');

  for (const account of accounts) {
    console.log(
      `${account.id} | ${account.name} | ${account.profile} | enabled=${account.enabled}`
    );
  }

  console.log('');
  console.log('=== AKUN AKTIF ===');

  const enabledAccounts =
    accountManager.getEnabledAccounts();

  for (const account of enabledAccounts) {
    console.log(
      `${account.id} → ${account.profile}`
    );
  }

} catch (error) {
  console.error('');
  console.error('GAGAL MEMBACA AKUN');
  console.error(error.message);
}

