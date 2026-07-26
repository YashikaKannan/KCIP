/**
 * @file NotificationController.js
 * @description Notification Controller
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseController } from './BaseController.js';
import { ResponseUtil } from '../utils/response.js';

export class NotificationController extends BaseController {
  constructor(service = null) {
    super(service);
  }

  async execute(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      if (payload?.action === 'list') {
        const data = await this.service.getByRecipient(payload.recipientId, payload);
        return ResponseUtil.success(data);
      }
      if (payload?.action === 'markRead') {
        const data = await this.service.markAsRead(payload.notificationId || payload.id);
        return ResponseUtil.success(data);
      }
      if (payload?.action === 'unread') {
        const data = await this.service.getUnread(payload.recipientId);
        return ResponseUtil.success(data);
      }
      const data = await this.service.sendNotification(
        payload?.recipientId,
        payload?.title,
        payload?.message,
        payload?.type
      );
      return ResponseUtil.success(data, 'Notification sent', 201);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }
}
