/**
 * @file appConfig.js
 * @description Backend Application Level Configuration
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export const appConfig = Object.freeze({
  appName: 'Karnataka Crime Intelligence Platform - Backend',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: '/api/v1',
  defaultLanguage: 'en-IN'
});
