/**
 * @file IPredictionService.js
 * @description AI Prediction Service Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for IPredictionService.
 * Defines standard method signatures without concrete backend logic.
 */
export class IPredictionService {
  /**
   * Method contract for predictCrimeSpikes(district, timeframe)
   */
  predictCrimeSpikes(district, timeframe) {
    throw new Error('Method predictCrimeSpikes(district, timeframe) must be implemented.');
  }
  /**
   * Method contract for generateHotspots(district, radius)
   */
  generateHotspots(district, radius) {
    throw new Error('Method generateHotspots(district, radius) must be implemented.');
  }
  /**
   * Method contract for assessRecidivism(accusedId)
   */
  assessRecidivism(accusedId) {
    throw new Error('Method assessRecidivism(accusedId) must be implemented.');
  }
}
