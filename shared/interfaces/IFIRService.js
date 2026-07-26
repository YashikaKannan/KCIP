/**
 * @file IFIRService.js
 * @description FIR Business Operations Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for IFIRService.
 * Defines standard method signatures without concrete backend logic.
 */
export class IFIRService {
  /**
   * Method contract for registerFIR(firData)
   */
  registerFIR(firData) {
    throw new Error('Method registerFIR(firData) must be implemented.');
  }
  /**
   * Method contract for getFIRByNumber(firNumber)
   */
  getFIRByNumber(firNumber) {
    throw new Error('Method getFIRByNumber(firNumber) must be implemented.');
  }
  /**
   * Method contract for updateFIRStatus(firNumber, status)
   */
  updateFIRStatus(firNumber, status) {
    throw new Error('Method updateFIRStatus(firNumber, status) must be implemented.');
  }
  /**
   * Method contract for listFIRsByDistrict(district, filters)
   */
  listFIRsByDistrict(district, filters) {
    throw new Error('Method listFIRsByDistrict(district, filters) must be implemented.');
  }
}
