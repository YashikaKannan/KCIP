/**
 * @file BaseService.js
 * @description Base Service Layer with repository guards and Catalyst app rebinding
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../utils/logger.js';

export class BaseService {
  constructor(repository = null) {
    this.repository = repository;
  }

  /**
   * Ensure a repository is attached before data-access operations.
   * @returns {object}
   */
  requireRepository() {
    if (!this.repository) {
      throw new Error(`${this.constructor.name} requires a repository instance.`);
    }
    return this.repository;
  }

  /**
   * Propagate Catalyst App into the underlying repository for the current request.
   * @param {object|null} catalystApp
   */
  setCatalystApp(catalystApp) {
    if (this.repository && typeof this.repository.setCatalystApp === 'function') {
      this.repository.setCatalystApp(catalystApp);
    }
  }

  /**
   * Structured error log helper.
   * @param {string} action
   * @param {Error} error
   * @param {object} [meta]
   */
  logError(action, error, meta = {}) {
    LoggerUtil.error(`[${this.constructor.name}] ${action}`, {
      error: error?.message || String(error),
      ...meta
    });
  }
}
