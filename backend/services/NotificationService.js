/**
 * @file NotificationService.js
 * @description System Notification Business Service
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseService } from './BaseService.js';

export class NotificationService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  async sendNotification(recipientId, title, message) {
    if (!recipientId || !title) throw new Error('Recipient ID and Title required.');
    return { id: 'NOTIF-' + Date.now(), recipientId, title, message, isRead: false, createdAt: new Date().toISOString() };
  }

}
