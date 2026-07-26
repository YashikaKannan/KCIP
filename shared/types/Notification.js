/**
 * @file Notification.js
 * @description System Notification Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Notification.
 * @type {Readonly<Object>}
 */
export const defaultNotification = Object.freeze({ id: '', recipientId: '', type: 'CRIME_ALERT', title: '', message: '', isRead: false, createdAt: '' });

/**
 * Example valid entity structure for Notification.
 * @type {Readonly<Object>}
 */
export const exampleNotification = Object.freeze({ id: 'NOTIF-901', recipientId: 'usr-101', type: 'CRIME_ALERT', title: 'Hotspot Alert Koramangala', message: 'High probability of property crime detected.', isRead: false, createdAt: '2026-07-25T10:00:00Z' });
