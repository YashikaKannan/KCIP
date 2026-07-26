/**
 * @file repositoryConfig.js
 * @description Repository Layer Data Access Configuration
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

export const repositoryConfig = Object.freeze({
  defaultPageSize: 20,
  maxPageSize: 100,
  queryTimeoutMs: 10000,
  /** Catalyst Data Store table names (aligned with database/datastore-schema.json) */
  tables: Object.freeze({
    firs: 'FIRs',
    victims: 'Victims',
    accused: 'Accused',
    arrests: 'Arrests',
    chargesheets: 'Chargesheets',
    predictions: 'Predictions',
    hotspots: 'Hotspots',
    notifications: 'Notifications',
    reports: 'Reports',
    auditLogs: 'AuditLogs'
  })
});
