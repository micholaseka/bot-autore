import { existsSync } from 'node:fs';
import { CONFIG } from './config.js';

console.log('=== CHROME CONFIG TEST ===');

console.log('');
console.log('Project Root:');
console.log(CONFIG.projectRoot);

console.log('');
console.log('Chrome Portable:');
console.log(CONFIG.chrome.portableDir);

console.log('');
console.log('Chrome Executable:');
console.log(CONFIG.chrome.executablePath);

console.log('');
console.log('Chrome User Data:');
console.log(CONFIG.chrome.userDataDir);

console.log('');
console.log('=== CHECK ===');

console.log(
  'chrome.exe:',
  existsSync(CONFIG.chrome.executablePath)
    ? 'OK'
    : 'TIDAK DITEMUKAN'
);

console.log(
  'user-data-dir:',
  existsSync(CONFIG.chrome.userDataDir)
    ? 'OK'
    : 'TIDAK DITEMUKAN'
);