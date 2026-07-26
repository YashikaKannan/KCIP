/**
 * @file Hotspot.js
 * @description Geospatial Crime Hotspot Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Hotspot
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Hotspot.
 * @type {Readonly<Object>}
 */
export const defaultHotspot = Object.freeze({ hotspotId: '', district: '', centerLat: 0, centerLng: 0, radiusMeters: 500, riskScore: 0, crimeCount: 0 });

/**
 * Example valid entity structure for Hotspot.
 * @type {Readonly<Object>}
 */
export const exampleHotspot = Object.freeze({ hotspotId: 'HS-401', district: 'Bengaluru Urban', centerLat: 12.9352, centerLng: 77.6245, radiusMeters: 800, riskScore: 88.5, crimeCount: 42 });
