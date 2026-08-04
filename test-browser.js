import { BrowserManager } from './browserManager.js';

const browserManager = new BrowserManager();

try {
  console.log('Mencoba membuka Profile 1...');

  await browserManager.launchProfile('Profile 1');

  console.log('Browser berhasil dibuka.');
  console.log('Tekan Ctrl + C untuk menghentikan test.');
} catch (error) {
  console.error('');
  console.error('GAGAL MEMBUKA BROWSER');
  console.error(error);
}