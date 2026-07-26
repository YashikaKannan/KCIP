/**
 * @file GraphEdge.js
 * @description Crime Network Graph Edge Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} GraphEdge
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for GraphEdge.
 * @type {Readonly<Object>}
 */
export const defaultGraphEdge = Object.freeze({ id: '', source: '', target: '', relationType: 'ASSOCIATE_OF', weight: 1.0 });

/**
 * Example valid entity structure for GraphEdge.
 * @type {Readonly<Object>}
 */
export const exampleGraphEdge = Object.freeze({ id: 'EDGE-101', source: 'NODE-ACC-802', target: 'NODE-ACC-901', relationType: 'CO_ACCUSED', weight: 0.95 });
