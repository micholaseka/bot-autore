
export class InboxService {
  constructor(context) {
    this.context = context;
  }

  async getPage() {
    const pages = this.context.pages();

    if (pages.length > 0) {
      return pages[0];
    }

    return await this.context.newPage();
  }

  async inspectMarketplacePage() {
    const page = await this.getPage();

    console.log('');
    console.log('=== MARKETPLACE PAGE INSPECTOR ===');

    console.log('URL:');
    console.log(page.url());

    console.log('');
    console.log('TITLE:');

    const title = await page.title();
    console.log(title);

    console.log('');
    console.log('VISIBLE TEXT:');

    const bodyText = await page.locator('body').innerText();

    console.log(bodyText.substring(0, 15000));

    console.log('');
    console.log('=== INSPECTION SELESAI ===');

    return {
      url: page.url(),
      title,
      bodyText
    };
  }
}
