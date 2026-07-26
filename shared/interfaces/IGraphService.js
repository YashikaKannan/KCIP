/**
 * @file IGraphService.js
 * @description Crime Network Graph Service Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for IGraphService.
 * Defines standard method signatures without concrete backend logic.
 */
export class IGraphService {
  /**
   * Method contract for buildCrimeNetwork(rootNodeId, depth)
   */
  buildCrimeNetwork(rootNodeId, depth) {
    throw new Error('Method buildCrimeNetwork(rootNodeId, depth) must be implemented.');
  }
  /**
   * Method contract for findShortestPath(sourceId, targetId)
   */
  findShortestPath(sourceId, targetId) {
    throw new Error('Method findShortestPath(sourceId, targetId) must be implemented.');
  }
  /**
   * Method contract for getDegreeCentrality(nodeId)
   */
  getDegreeCentrality(nodeId) {
    throw new Error('Method getDegreeCentrality(nodeId) must be implemented.');
  }
}
