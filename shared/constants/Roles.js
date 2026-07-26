/**
 * @file Roles.js
 * @description System Role Definitions for Karnataka State Police KCIP Platform
 * @author KCIP Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/**
 * Canonical role codes used in authorization checks.
 * Display aliases map to the human-readable Karnataka Police roles.
 */
export const Roles = Object.freeze({
  // Canonical
  SCRB_ADMIN: 'SCRB_ADMIN',
  STATE_OFFICER: 'STATE_OFFICER',
  DISTRICT_OFFICER: 'DISTRICT_OFFICER',
  INVESTIGATION_OFFICER: 'INVESTIGATION_OFFICER',
  ANALYST: 'ANALYST',
  STATION_WRITER: 'STATION_WRITER',
  FIELD_OFFICER: 'FIELD_OFFICER',

  // Requested platform aliases
  ADMINISTRATOR: 'SCRB_ADMIN',
  SCRB: 'SCRB_ADMIN',
  DISTRICT_SP: 'DISTRICT_OFFICER',
  POLICE_OFFICER: 'FIELD_OFFICER',
  INVESTIGATING_OFFICER: 'INVESTIGATION_OFFICER'
});

/** Human-readable labels for UI / audit */
export const RoleLabels = Object.freeze({
  SCRB_ADMIN: 'Administrator / SCRB',
  STATE_OFFICER: 'State Officer',
  DISTRICT_OFFICER: 'District SP',
  INVESTIGATION_OFFICER: 'Investigating Officer',
  ANALYST: 'SCRB Analyst',
  STATION_WRITER: 'Station Writer',
  FIELD_OFFICER: 'Police Officer'
});

/** Default permission sets per role */
export const RolePermissions = Object.freeze({
  SCRB_ADMIN: [
    'fir:create', 'fir:read', 'fir:update', 'fir:delete',
    'analytics:view', 'hotspot:view', 'prediction:run',
    'report:generate', 'user:manage', 'evidence:upload', 'arrest:update'
  ],
  STATE_OFFICER: [
    'fir:read', 'fir:update', 'analytics:view', 'hotspot:view',
    'prediction:run', 'report:generate', 'evidence:upload'
  ],
  DISTRICT_OFFICER: [
    'fir:create', 'fir:read', 'fir:update', 'analytics:view',
    'hotspot:view', 'prediction:run', 'report:generate',
    'evidence:upload', 'arrest:update'
  ],
  INVESTIGATION_OFFICER: [
    'fir:create', 'fir:read', 'fir:update', 'evidence:upload',
    'arrest:update', 'hotspot:view', 'analytics:view'
  ],
  ANALYST: [
    'fir:read', 'analytics:view', 'hotspot:view',
    'prediction:run', 'report:generate'
  ],
  STATION_WRITER: [
    'fir:create', 'fir:read', 'fir:update', 'evidence:upload'
  ],
  FIELD_OFFICER: [
    'fir:create', 'fir:read', 'evidence:upload', 'arrest:update'
  ]
});

/**
 * Normalize any role alias to a canonical Roles value.
 * @param {string} role
 * @returns {string}
 */
export function normalizeRole(role) {
  if (!role) return Roles.FIELD_OFFICER;
  const key = String(role).trim().toUpperCase().replace(/\s+/g, '_');
  if (Roles[key]) return Roles[key];
  if (Object.values(Roles).includes(key)) return key;

  const aliases = {
    ADMINISTRATOR: Roles.SCRB_ADMIN,
    ADMIN: Roles.SCRB_ADMIN,
    SCRB: Roles.SCRB_ADMIN,
    DISTRICT_SP: Roles.DISTRICT_OFFICER,
    SP: Roles.DISTRICT_OFFICER,
    POLICE_OFFICER: Roles.FIELD_OFFICER,
    POLICE: Roles.FIELD_OFFICER,
    INVESTIGATING_OFFICER: Roles.INVESTIGATION_OFFICER,
    IO: Roles.INVESTIGATION_OFFICER
  };
  return aliases[key] || Roles.FIELD_OFFICER;
}
