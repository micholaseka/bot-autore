import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder project
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Chrome Portable
const CHROME_PORTABLE_DIR = path.join(
  PROJECT_ROOT,
  'GoogleChromePortable64'
);

// Chrome executable
const CHROME_EXECUTABLE = path.join(
  CHROME_PORTABLE_DIR,
  'App',
  'Chrome-bin',
  'chrome.exe'
);

// Chrome user data
const CHROME_USER_DATA_DIR = path.join(
  CHROME_PORTABLE_DIR,
  'Data',
  'profile'
);

export const CONFIG = {
  projectRoot: PROJECT_ROOT,

  chrome: {
    portableDir: CHROME_PORTABLE_DIR,
    executablePath: CHROME_EXECUTABLE,
    userDataDir: CHROME_USER_DATA_DIR,
  }
};