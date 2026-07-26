/**
 * @file GraphNode.js
 * @description Crime Network Graph Node Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for GraphNode.
 * @type {Readonly<Object>}
 */
export const defaultGraphNode = Object.freeze({ id: '', label: '', type: 'SUSPECT', properties: {} });

/**
 * Example valid entity structure for GraphNode.
 * @type {Readonly<Object>}
 */
export const exampleGraphNode = Object.freeze({ id: 'NODE-ACC-802', label: 'Ramesh Singh (Ramu)', type: 'SUSPECT', properties: { alias: 'Ramu', riskScore: 82 } });
