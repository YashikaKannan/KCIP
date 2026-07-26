/**
 * @file BaseService.js
 * @description Base Service Layer
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class BaseService {
  constructor(repository = null) {
    this.repository = repository;
  }
}
