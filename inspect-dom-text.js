
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('           DOM TEXT INSPECTOR');
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

  // ========================================
  // 4. DASHBOARD
  // ========================================

  console.log('');
  console.log('[6] Membuka Marketplace Dashboard...');

  await page.goto(
      'https://www.facebook.com/marketplace/you/dashboard',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  await page.waitForTimeout(5000);

  // ========================================
  // 5. OPEN INBOX
  // ========================================

  console.log('');
  console.log('[7] Mencari Chats to answer...');

  const chatLink =
    page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).first();

  const chatCount =
    await page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).count();

  console.log(
    `[8] Link ditemukan: ${chatCount}`
  );

  if (chatCount === 0) {
    throw new Error(
      'Chats to answer tidak ditemukan.'
    );
  }

  console.log('');
  console.log('[9] Membuka Inbox...');

  await chatLink.scrollIntoViewIfNeeded();

  await chatLink.click();

  await page.waitForTimeout(8000);

  console.log('[10] Inbox terbuka.');

  // ========================================
  // 6. CONFIRM BODY TEXT
  // ========================================

  console.log('');
  console.log('[11] Memeriksa body...');

  const bodyText =
    await page.locator('body').innerText();

  console.log(
    `Panjang body text: ${bodyText.length}`
  );

  console.log(
    `Apakah mengandung "Selvi"? ${
      bodyText.includes('Selvi')
    }`
  );

  // ========================================
  // 7. CARI SEMUA ELEMEN YANG
  //    TEXT-NYA MENGANDUNG "SELVI"
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('       ELEMEN YANG MENGANDUNG SELVI');
  console.log('========================================');

  const results =
    await page.locator('body *').evaluateAll(
      elements => {

        return elements
          .filter(element => {

            const text =
              element.innerText || '';

            return text.includes('Selvi');

          })
          .map(element => {

            const rect =
              element.getBoundingClientRect();

            const attributes = {};

            for (const attr of element.attributes) {
              attributes[attr.name] = attr.value;
            }

            return {
              tag: element.tagName,
              text:
                (element.innerText || '')
                  .substring(0, 1000),
              className:
                typeof element.className === 'string'
                  ? element.className
                  : '',
              attributes,
              visible:
                rect.width > 0 &&
                rect.height > 0,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            };

          })
          .slice(0, 50);
      }
    );

  console.log(
    `Jumlah kandidat elemen: ${results.length}`
  );

  for (
    let i = 0;
    i < results.length;
    i++
  ) {

    console.log('');
    console.log(
      `========== ELEMENT ${i} ==========`
    );

    console.log(
      JSON.stringify(
        results[i],
        null,
        2
      )
    );
  }

  // ========================================
  // 8. CARI TEKS DI HTML
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('       HTML DI SEKITAR "SELVI"');
  console.log('========================================');

  const htmlAround =
    await page.evaluate(() => {

      const html =
        document.documentElement.innerHTML;

      const index =
        html.indexOf('Selvi');

      if (index === -1) {
        return 'TEKS SELVI TIDAK DITEMUKAN DI HTML';
      }

      const start =
        Math.max(0, index - 3000);

      const end =
        Math.min(
          html.length,
          index + 5000
        );

      return html.substring(
        start,
        end
      );
    });

  console.log(htmlAround);

  // ========================================
  // 9. FINISH
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('          INSPEKSI SELESAI');
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
