/**
 * @file pagination.js
 * @description Backend Pagination Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class PaginationUtil {
  static getParams(page = 1, pageSize = 20) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
    const offset = (p - 1) * ps;
    return { page: p, pageSize: ps, offset };
  }
}
