/**
 * @file PaginationHelper.js
 * @description Pure Pagination Calculation Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class PaginationHelper {
  static paginate(array = [], page = 1, pageSize = 20) {
    const validPage = Math.max(1, page);
    const validSize = Math.max(1, pageSize);
    const offset = (validPage - 1) * validSize;
    return array.slice(offset, offset + validSize);
  }

  static calculateTotalPages(total = 0, pageSize = 20) {
    return Math.ceil(total / Math.max(1, pageSize));
  }

  static getOffset(page = 1, pageSize = 20) {
    return (Math.max(1, page) - 1) * Math.max(1, pageSize);
  }
}
