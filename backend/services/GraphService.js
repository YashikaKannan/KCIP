/**
 * @file GraphService.js
 * @description Crime Network Graph Analytics Service — Cytoscape JSON
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';

export class GraphService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  /**
   * Build Cytoscape-compatible crime network for a root entity.
   * @param {string} rootNodeId
   * @param {number} [depth=2]
   * @returns {Promise<object>}
   */
  async getNetworkGraph(rootNodeId, depth = 2) {
    const repo = this.requireRepository();
    if (!rootNodeId) throw new Error('Root Node ID required.');

    const network = await repo.getNetworkByRootId(rootNodeId, depth);
    return {
      rootNodeId,
      depth: network.summary?.depth ?? depth,
      nodes: network.nodes || [],
      edges: network.edges || [],
      summary: network.summary || {
        nodeCount: (network.nodes || []).length,
        edgeCount: (network.edges || []).length
      }
    };
  }
}
