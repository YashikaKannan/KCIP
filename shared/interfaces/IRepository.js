/**
 * @file IRepository.js
 * @description Generic Data Repository Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for IRepository.
 * Defines standard method signatures without concrete backend logic.
 */
export class IRepository {
  /**
   * Method contract for findById(id)
   */
  findById(id) {
    throw new Error('Method findById(id) must be implemented.');
  }
  /**
   * Method contract for findAll(query)
   */
  findAll(query) {
    throw new Error('Method findAll(query) must be implemented.');
  }
  /**
   * Method contract for create(data)
   */
  create(data) {
    throw new Error('Method create(data) must be implemented.');
  }
  /**
   * Method contract for update(id, data)
   */
  update(id, data) {
    throw new Error('Method update(id, data) must be implemented.');
  }
  /**
   * Method contract for delete(id)
   */
  delete(id) {
    throw new Error('Method delete(id) must be implemented.');
  }
}
