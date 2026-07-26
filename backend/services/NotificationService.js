/**
 * @file NotificationService.js
 * @description System Notification Business Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class NotificationService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  _generateNotificationId() {
    return `NOTIF-${Date.now()}`;
  }

  async sendNotification(recipientId, title, message, type = 'INFO') {
    const repo = this.requireRepository();
    if (!recipientId || !title) {
      throw new Error('Recipient ID and Title required.');
    }

    const notificationId = this._generateNotificationId();
    const row = MapperUtil.toDataStore({
      notificationId,
      recipientId,
      type,
      title,
      message: message || '',
      isRead: false
    });

    const created = await repo.create(row);
    return MapperUtil.fromDataStore(created);
  }

  async getByRecipient(recipientId, options = {}) {
    const repo = this.requireRepository();
    if (!recipientId) throw new Error('Recipient ID is required.');
    const result = await repo.findByRecipientId(recipientId, options);
    if (Array.isArray(result)) {
      return MapperUtil.fromDataStoreMany(result);
    }
    return {
      ...result,
      data: MapperUtil.fromDataStoreMany(result.data || [])
    };
  }

  async markAsRead(notificationId) {
    const repo = this.requireRepository();
    if (!notificationId) throw new Error('Notification ID is required.');
    return repo.markAsRead(notificationId);
  }

  async getUnread(recipientId) {
    const repo = this.requireRepository();
    return MapperUtil.fromDataStoreMany(await repo.findUnread(recipientId));
  }

  async listNotifications(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }
}
