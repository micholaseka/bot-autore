import fs from 'node:fs';
import path from 'node:path';
import { CONFIG } from './config.js';

export class AccountManager {
  constructor() {
    this.accountsFile = path.join(
      CONFIG.projectRoot,
      'config',
      'accounts.json'
    );

    this.accounts = [];
  }

  loadAccounts() {
    if (!fs.existsSync(this.accountsFile)) {
      throw new Error(
        `File accounts.json tidak ditemukan: ${this.accountsFile}`
      );
    }

    const fileContent = fs.readFileSync(
      this.accountsFile,
      'utf8'
    );

    const data = JSON.parse(fileContent);

    if (!Array.isArray(data.accounts)) {
      throw new Error(
        'Format accounts.json tidak valid. "accounts" harus berupa array.'
      );
    }

    this.accounts = data.accounts;

    return this.accounts;
  }

  getAllAccounts() {
    return this.accounts;
  }

  getEnabledAccounts() {
    return this.accounts.filter(
      account => account.enabled === true
    );
  }

  getAccountById(id) {
    return this.accounts.find(
      account => account.id === id
    );
  }
}

