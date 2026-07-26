/**
 * @file NotificationModel.js
 * @description System Notification Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class NotificationModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.notificationId = data.notificationId || null;
    this.recipientId = data.recipientId || null;
    this.type = data.type || null;
    this.title = data.title || null;
    this.message = data.message || null;
    this.isRead = data.isRead || null;
    this.createdAt = data.createdAt || null;
  }
}
