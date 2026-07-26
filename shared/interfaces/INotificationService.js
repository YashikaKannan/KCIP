/**
 * @file INotificationService.js
 * @description Notification Service Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for INotificationService.
 * Defines standard method signatures without concrete backend logic.
 */
export class INotificationService {
  /**
   * Method contract for sendNotification(recipientId, notification)
   */
  sendNotification(recipientId, notification) {
    throw new Error('Method sendNotification(recipientId, notification) must be implemented.');
  }
  /**
   * Method contract for markAsRead(notificationId)
   */
  markAsRead(notificationId) {
    throw new Error('Method markAsRead(notificationId) must be implemented.');
  }
  /**
   * Method contract for getUserNotifications(userId)
   */
  getUserNotifications(userId) {
    throw new Error('Method getUserNotifications(userId) must be implemented.');
  }
}
