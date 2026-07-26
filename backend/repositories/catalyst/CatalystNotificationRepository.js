/**
 * @file CatalystNotificationRepository.js
 * @description Catalyst Notification Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystNotificationRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Notifications', catalystApp);
  }

  /**
   * @param {string} recipientId
   * @param {object} [options]
   * @returns {Promise<object[]|{ data: object[], page: number, pageSize: number, total: number }>}
   */
  async findByRecipientId(recipientId, options = {}) {
    return this.findAll({
      ...options,
      filter: { ...(options.filter || {}), RecipientID: recipientId },
      sortBy: options.sortBy || 'ROWID',
      sortOrder: options.sortOrder || 'desc'
    });
  }

  /**
   * @param {string|number} notificationId - NotificationID or ROWID
   * @returns {Promise<object>}
   */
  async markAsRead(notificationId) {
    const byBizId = await this.findOne({ NotificationID: notificationId });
    const row = byBizId || (await this.findById(notificationId));
    if (!row || !row.ROWID) {
      return { updated: false, notificationId };
    }
    const updated = await this.update(row.ROWID, { IsRead: true });
    return { updated: true, notificationId, data: updated };
  }

  /**
   * Unread notifications for a recipient.
   * @param {string} recipientId
   * @returns {Promise<object[]>}
   */
  async findUnread(recipientId) {
    return this.search({ RecipientID: recipientId, IsRead: false });
  }
}
