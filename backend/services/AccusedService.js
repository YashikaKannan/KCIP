/**
 * @file AccusedService.js
 * @description Accused Management Service
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseService } from './BaseService.js';

export class AccusedService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  async addAccused(accusedData) {
    if (!accusedData.name || !accusedData.firNumber) throw new Error('Accused name and FIR Number required.');
    return { id: 'ACC-' + Date.now(), ...accusedData };
  }

}
