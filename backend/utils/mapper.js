/**
 * @file mapper.js
 * @description Backend Object Mapping Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class MapperUtil {
  static mapToDTO(sourceObj, dtoTemplate) {
    if (!sourceObj) return null;
    const result = { ...dtoTemplate };
    Object.keys(dtoTemplate).forEach(key => {
      if (sourceObj[key] !== undefined) {
        result[key] = sourceObj[key];
      }
    });
    return result;
  }
}
