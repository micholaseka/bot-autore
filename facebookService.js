export class FacebookService {
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

  async openMarketplaceDashboard() {
    const page = await this.getPage();

    console.log('Membuka Facebook Marketplace...');

    await page.goto(
      'https://www.facebook.com/marketplace/you/dashboard',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    console.log('Facebook Marketplace berhasil dibuka.');

    return page;
  }

  async getCurrentUrl() {
    const page = await this.getPage();

    return page.url();
  }
}
