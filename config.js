import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '..');

// Setiap akun punya browser profile sendiri.
const PROFILES_ROOT = path.join(PROJECT_ROOT, 'profiles');

// Override dengan CHROME_EXECUTABLE bila Chrome berada di lokasi lain.
const CHROME_EXECUTABLE =
  process.env.CHROME_EXECUTABLE ||
  (process.platform === 'win32'
    ? path.join(PROJECT_ROOT, 'GoogleChromePortable64', 'App', 'Chrome-bin', 'chrome.exe')
    : '');

export const CONFIG = {
  projectRoot: PROJECT_ROOT,

  accounts: {
    file: path.join(PROJECT_ROOT, 'config', 'accounts.json')
  },

  chrome: {
    profilesRoot: PROFILES_ROOT,
    executablePath: CHROME_EXECUTABLE
  },

  marketplace: {
    dashboardUrl: 'https://www.facebook.com/marketplace/you/dashboard',
    inboxUrlPrefix: 'https://www.facebook.com/marketplace/inbox/'
  },

  phase1: {
    // Fase 1 sengaja single-worker.
    maxAccountsPerCycle: 5,
    settleDelayMs: 2500,
    accountCooldownMs: 1000,
    pageTimeoutMs: 60000
  }
};
