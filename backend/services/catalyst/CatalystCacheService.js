/**
 * @file CatalystCacheService.js
 * @description Zoho Catalyst Cache Service Adapter
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class CatalystCacheService {
  constructor(catalystApp = null) {
    this.catalystApp = catalystApp;
  }

  async put(key, value, ttlSeconds = 300) {
    if (this.catalystApp && typeof this.catalystApp.cache === 'function') {
      const cache = this.catalystApp.cache();
      const segment = cache.segment('default');
      return await segment.put(key, JSON.stringify(value), ttlSeconds);
    }
    return true;
  }

  async get(key) {
    if (this.catalystApp && typeof this.catalystApp.cache === 'function') {
      const cache = this.catalystApp.cache();
      const segment = cache.segment('default');
      const val = await segment.get(key);
      return val ? JSON.parse(val) : null;
    }
    return null;
  }
}
