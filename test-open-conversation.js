
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('      TEST OPEN CONVERSATION');
console.log('========================================');

const accountManager = new AccountManager();
const browserManager = new BrowserManager();

try {

  // ========================================
  // 1. ACCOUNT
  // ========================================

  console.log('');
  console.log('[1] Membaca akun...');

  accountManager.loadAccounts();

  const accounts =
    accountManager.getEnabledAccounts();

  if (accounts.length === 0) {
    throw new Error('Tidak ada akun aktif.');
  }

  const account = accounts[0];

  console.log(`Account : ${account.id}`);
  console.log(`Profile : ${account.profile}`);


  // ========================================
  // 2. BUKA CHROME
  // ========================================

  console.log('');
  console.log('[2] Membuka Chrome...');

  const context =
    await browserManager.launchProfile(
      account.profile
    );

  console.log('Chrome berhasil dibuka.');


  // ========================================
  // 3. AMBIL PAGE
  // ========================================

  const pages = context.pages();

  const page =
    pages.length > 0
      ? pages[0]
      : await context.newPage();

  console.log(`Jumlah page: ${pages.length}`);

  console.log(`URL awal: ${page.url()}`);


  // ========================================
  // 4. BUKA DASHBOARD
  // ========================================

  console.log('');
  console.log('[3] Membuka Marketplace Dashboard...');

  await page.goto(
    'https://www.facebook.com/marketplace/you/dashboard/',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  await page.waitForTimeout(5000);

  console.log(`URL dashboard: ${page.url()}`);


  // ========================================
  // 5. CARI LINK INBOX
  // ========================================

  console.log('');
  console.log('[4] Mencari Inbox...');

  const inboxLink =
    page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).first();

  const inboxCount =
    await page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).count();

  console.log(
    `Jumlah link Inbox: ${inboxCount}`
  );

  if (inboxCount === 0) {
    throw new Error(
      'Link Inbox tidak ditemukan.'
    );
  }


  // ========================================
  // 6. KLIK INBOX
  // ========================================

  console.log('');
  console.log('[5] Membuka Inbox...');

  await inboxLink.scrollIntoViewIfNeeded();

  await inboxLink.click();

  await page.waitForTimeout(7000);

  console.log(
    `URL Inbox: ${page.url()}`
  );


  // ========================================
  // 7. CARI ROW YANG MENGANDUNG SELVI
  // ========================================

  console.log('');
  console.log('[6] Mencari percakapan Selvi...');

  const rows =
    page.locator(
      '[role="button"]'
    );

  const rowCount =
    await rows.count();

  console.log(
    `Total role=button: ${rowCount}`
  );


  let targetRow = null;


  for (
    let i = 0;
    i < rowCount;
    i++
  ) {

    const row = rows.nth(i);

    const text =
      await row.innerText()
        .catch(() => '');

    if (
      text &&
      text.includes('Selvi')
    ) {

      console.log('');
      console.log(
        '========================================'
      );

      console.log(
        'CONVERSATION DITEMUKAN'
      );

      console.log(
        '========================================'
      );

      console.log(text);

      targetRow = row;

      break;
    }
  }


  // ========================================
  // 8. VALIDASI
  // ========================================

  if (!targetRow) {

    console.log('');
    console.log(
      'SELVI TIDAK DITEMUKAN'
    );

    console.log('');
    console.log(
      'Daftar teks role=button yang memiliki isi:'
    );

    for (
      let i = 0;
      i < Math.min(rowCount, 100);
      i++
    ) {

      const text =
        await rows.nth(i)
          .innerText()
          .catch(() => '');

      if (text.trim()) {

        console.log('');
        console.log(
          `--- BUTTON ${i} ---`
        );

        console.log(
          text.substring(0, 500)
        );
      }
    }

    throw new Error(
      'Percakapan Selvi tidak ditemukan.'
    );
  }


  // ========================================
  // 9. SCROLL
  // ========================================

  console.log('');
  console.log('[7] Scroll ke percakapan...');

  await targetRow.scrollIntoViewIfNeeded();

  await page.waitForTimeout(1000);


  // ========================================
  // 10. KLIK
  // ========================================

  console.log('');
  console.log(
    '[8] Mengklik percakapan Selvi...'
  );

  await targetRow.click();

  await page.waitForTimeout(5000);


  // ========================================
  // 11. CEK URL
  // ========================================

  console.log('');
  console.log(
    '========================================'
  );

  console.log(
    'SETELAH KLIK'
  );

  console.log(
    '========================================'
  );

  console.log(
    `URL: ${page.url()}`
  );


  // ========================================
  // 12. BACA BODY
  // ========================================

  const bodyText =
    await page.locator('body').innerText();

  console.log('');
  console.log(
    '========================================'
  );

  console.log(
    'TEXT SETELAH MEMBUKA CHAT'
  );

  console.log(
    '========================================'
  );

  console.log(
    bodyText.substring(
      Math.max(
        0,
        bodyText.length - 10000
      )
    )
  );


  // ========================================
  // 13. SELESAI
  // ========================================

  console.log('');
  console.log(
    '========================================'
  );

  console.log(
    'TEST OPEN CONVERSATION SELESAI'
  );

  console.log(
    '========================================'
  );

  console.log('');
  console.log(
    'Browser dibiarkan terbuka.'
  );

  console.log(
    'Tekan Ctrl + C untuk menghentikan.'
  );

} catch (error) {

  console.log('');
  console.log(
    '========================================'
  );

  console.log(
    'ERROR'
  );

  console.log(
    '========================================'
  );

  console.error(error);
}
