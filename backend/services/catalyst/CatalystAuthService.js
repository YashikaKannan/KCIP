/**
 * @file CatalystAuthService.js
 * @description Zoho Catalyst Authentication Adapter
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class CatalystAuthService {
  constructor(catalystApp = null) {
    this.catalystApp = catalystApp;
  }

  async getCurrentUser(req) {
    if (this.catalystApp && typeof this.catalystApp.auth === 'function') {
      const user = await this.catalystApp.auth().getCurrentUser();
      return user;
    }
    return { user_id: 'usr-101', email: 'officer@ksp.gov.in', role_name: 'INVESTIGATION_OFFICER' };
  }
}
