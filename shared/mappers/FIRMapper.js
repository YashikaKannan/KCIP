/**
 * @file FIRMapper.js
 * @description FIR Data Mapper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class FIRMapper {
  /**
   * Transforms raw entity / schema object to standard DTO payload.
   * @param {Object} entity
   * @returns {Object}
   */
  static toDTO(entity) {
    if (!entity) return null;
    return { ...entity };
  }

  /**
   * Transforms DTO payload to entity structure.
   * @param {Object} dto
   * @returns {Object}
   */
  static toEntity(dto) {
    if (!dto) return null;
    return { ...dto };
  }
}
