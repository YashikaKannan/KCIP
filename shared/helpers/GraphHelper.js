/**
 * @file GraphHelper.js
 * @description Pure Graph Topology Calculation Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class GraphHelper {
  static buildGraph(nodes = [], edges = []) {
    const adjacencyList = new Map();
    nodes.forEach(node => adjacencyList.set(node.id, []));
    edges.forEach(edge => {
      if (adjacencyList.has(edge.source)) adjacencyList.get(edge.source).push(edge.target);
      if (adjacencyList.has(edge.target)) adjacencyList.get(edge.target).push(edge.source);
    });
    return adjacencyList;
  }

  static getNodeNeighbors(graph, nodeId) {
    return graph.get(nodeId) || [];
  }

  static calculateDegreeCentrality(graph, nodeId) {
    const neighbors = graph.get(nodeId) || [];
    const totalNodes = graph.size;
    if (totalNodes <= 1) return 0;
    return neighbors.length / (totalNodes - 1);
  }
}
