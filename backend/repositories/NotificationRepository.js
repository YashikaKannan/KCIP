/**
 * @file NotificationRepository.js
 * @description Notification Repository — Catalyst Data Store implementation
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from './BaseRepository.js';
import { CatalystNotificationRepository } from './catalyst/CatalystNotificationRepository.js';

export class NotificationRepository extends BaseRepository {
  /**
   * @param {object|null} catalystApp - Initialised Catalyst App from function context
   */
  constructor(catalystApp = null) {
    super();
    this.store = new CatalystNotificationRepository(catalystApp);
  }

  setCatalystApp(catalystApp) {
    this.store.catalystApp = catalystApp;
  }

  async findById(id) {
    return this.store.findById(id);
  }

  async findAll(options = {}) {
    return this.store.findAll(options);
  }

  async create(data) {
    return this.store.create(data);
  }

  async update(id, data) {
    return this.store.update(id, data);
  }

  async delete(id) {
    return this.store.delete(id);
  }

  async search(query) {
    return this.store.search(query);
  }

  async bulkInsert(items) {
    return this.store.bulkInsert(items);
  }

  async count(filter = {}) {
    return this.store.count(filter);
  }

  async aggregate(pipeline) {
    return this.store.aggregate(pipeline);
  }

  async findByRecipientId(recipientId, options = {}) {
    return this.store.findByRecipientId(recipientId, options);
  }

  async markAsRead(notificationId) {
    return this.store.markAsRead(notificationId);
  }

  async findUnread(recipientId) {
    return this.store.findUnread(recipientId);
  }
}
