/**
 * @file ValidationHelper.js
 * @description Pure Validation Checking Utilities
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class ValidationHelper {
  static isEmpty(val) {
    return val === null || val === undefined || String(val).trim() === '';
  }

  static isEmail(val) {
    if (this.isEmpty(val)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(val));
  }

  static isPhoneNumber(val) {
    if (this.isEmpty(val)) return false;
    const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
    return phoneRegex.test(String(val));
  }

  static isUUID(val) {
    if (this.isEmpty(val)) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(String(val));
  }

  static isNumeric(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  static isLatitude(val) {
    return this.isNumeric(val) && Number(val) >= -90 && Number(val) <= 90;
  }

  static isLongitude(val) {
    return this.isNumeric(val) && Number(val) >= -180 && Number(val) <= 180;
  }
}
