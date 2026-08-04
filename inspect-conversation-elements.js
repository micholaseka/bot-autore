
import { AccountManager } from './accountManager.js';
import { BrowserManager } from './browserManager.js';

console.log('========================================');
console.log('   CONVERSATION ELEMENT INSPECTOR');
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
  // 2. BUKA CHROME
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
  // 5. BUKA CHAT TO ANSWER
  // ========================================

  console.log('');
  console.log('[7] Mencari Chats to answer...');

  const chatLink =
    page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).first();

  if (
    await page.locator(
      'a[href*="/marketplace/inbox/"]'
    ).count() === 0
  ) {
    throw new Error(
      'Chats to answer tidak ditemukan.'
    );
  }

  console.log('[8] Membuka Inbox...');

  await chatLink.scrollIntoViewIfNeeded();

  await chatLink.click();

  await page.waitForTimeout(8000);

  console.log('[9] Inbox berhasil dibuka.');

  // ========================================
  // 6. NAMA YANG KITA CARI
  // ========================================

  const customers = [
    'Selvi',
    'Muhammad',
    'YabisainAja',
    'Khalya',
    'Ali',
    'Mutu',
    'Haikal',
    'Adty',
    'Bimo'
  ];

  // ========================================
  // 7. CARI SETIAP NAMA
  // ========================================

  for (const customer of customers) {

    console.log('');
    console.log('========================================');
    console.log(`MENCARI: ${customer}`);
    console.log('========================================');

    const locator =
      page.getByText(
        customer,
        {
          exact: true
        }
      );

    const count =
      await locator.count();

    console.log(
      `Jumlah elemen "${customer}": ${count}`
    );

    if (count === 0) {
      console.log('Tidak ditemukan.');
      continue;
    }

    // ====================================
    // AMBIL ELEMEN PERTAMA
    // ====================================

    const element =
      locator.first();

    console.log('');
    console.log('TEXT:');

    console.log(
      await element.innerText()
    );

    // ====================================
    // TAG NAME + ATTRIBUTES
    // ====================================

    const info =
      await element.evaluate(
        el => {

          const attributes = {};

          for (const attr of el.attributes) {
            attributes[attr.name] = attr.value;
          }

          return {
            tagName: el.tagName,
            className: el.className,
            attributes
          };
        }
      );

    console.log('');
    console.log('ELEMENT INFO:');

    console.log(
      JSON.stringify(
        info,
        null,
        2
      )
    );

    // ====================================
    // PARENT 1
    // ====================================

    const parent1 =
      await element.evaluate(
        el => {

          const parent = el.parentElement;

          if (!parent) {
            return null;
          }

          return {
            tagName: parent.tagName,
            className: parent.className,
            text:
              parent.innerText?.substring(
                0,
                1000
              ),
            attributes:
              Object.fromEntries(
                [...parent.attributes]
                  .map(attr => [
                    attr.name,
                    attr.value
                  ])
              )
          };
        }
      );

    console.log('');
    console.log('PARENT 1:');

    console.log(
      JSON.stringify(
        parent1,
        null,
        2
      )
    );

    // ====================================
    // PARENT 2
    // ====================================

    const parent2 =
      await element.evaluate(
        el => {

          const parent =
            el.parentElement?.parentElement;

          if (!parent) {
            return null;
          }

          return {
            tagName: parent.tagName,
            className: parent.className,
            text:
              parent.innerText?.substring(
                0,
                1500
              ),
            attributes:
              Object.fromEntries(
                [...parent.attributes]
                  .map(attr => [
                    attr.name,
                    attr.value
                  ])
              )
          };
        }
      );

    console.log('');
    console.log('PARENT 2:');

    console.log(
      JSON.stringify(
        parent2,
        null,
        2
      )
    );

    // ====================================
    // PARENT 3
    // ====================================

    const parent3 =
      await element.evaluate(
        el => {

          const parent =
            el.parentElement
              ?.parentElement
              ?.parentElement;

          if (!parent) {
            return null;
          }

          return {
            tagName: parent.tagName,
            className: parent.className,
            text:
              parent.innerText?.substring(
                0,
                2000
              ),
            attributes:
              Object.fromEntries(
                [...parent.attributes]
                  .map(attr => [
                    attr.name,
                    attr.value
                  ])
              )
          };
        }
      );

    console.log('');
    console.log('PARENT 3:');

    console.log(
      JSON.stringify(
        parent3,
        null,
        2
      )
    );
  }

  // ========================================
  // 8. SELESAI
  // ========================================

  console.log('');
  console.log('========================================');
  console.log('       INSPEKSI SELESAI');
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
