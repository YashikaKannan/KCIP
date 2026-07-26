/**
 * @file FormatterHelper.js
 * @description String and Value Formatting Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class FormatterHelper {
  static normalizeString(str = '') {
    return String(str).trim().toLowerCase();
  }

  static slugify(str = '') {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static capitalize(str = '') {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static formatCurrency(amount = 0, currency = 'INR', locale = 'en-IN') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }

  static maskSensitiveData(str = '', visibleCount = 4) {
    if (!str) return '';
    const stringified = String(str);
    if (stringified.length <= visibleCount) return '****';
    return '*'.repeat(stringified.length - visibleCount) + stringified.slice(-visibleCount);
  }
}
