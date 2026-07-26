/**
 * @file mapper.js
 * @description Backend Object Mapping Utility
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

export class MapperUtil {
  static mapToDTO(sourceObj, dtoTemplate) {
    if (!sourceObj) return null;
    const result = { ...dtoTemplate };
    Object.keys(dtoTemplate).forEach((key) => {
      if (sourceObj[key] !== undefined) {
        result[key] = sourceObj[key];
      }
    });
    return result;
  }

  /**
   * Convert camelCase key to PascalCase (Catalyst Data Store column style).
   * @param {string} key
   * @returns {string}
   */
  static toPascalKey(key) {
    if (!key || typeof key !== 'string') return key;
    if (key === 'id') return 'ROWID';
    if (key === 'IPCSections' || key === 'ipcSections') return 'IPCSections';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  /**
   * Convert PascalCase key to camelCase for API responses.
   * @param {string} key
   * @returns {string}
   */
  static toCamelKey(key) {
    if (!key || typeof key !== 'string') return key;
    if (key === 'ROWID') return 'id';
    if (key === 'IPCSections') return 'ipcSections';
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  /**
   * Map a domain/API object to Catalyst Data Store column names.
   * @param {object} source
   * @param {string[]} [omitKeys]
   * @returns {object}
   */
  static toDataStore(source = {}, omitKeys = ['id', 'ROWID', '_offline']) {
    if (!source || typeof source !== 'object') return {};
    const out = {};
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      if (omitKeys.includes(key)) continue;
      out[this.toPascalKey(key)] = value;
    }
    return out;
  }

  /**
   * Map a Catalyst Data Store row to camelCase domain object.
   * @param {object|null} row
   * @returns {object|null}
   */
  static fromDataStore(row) {
    if (!row || typeof row !== 'object') return row ?? null;
    const out = {};
    for (const [key, value] of Object.entries(row)) {
      if (key === '_offline') {
        out._offline = value;
        continue;
      }
      out[this.toCamelKey(key)] = value;
    }
    if (row.ROWID !== undefined && out.id === undefined) {
      out.id = row.ROWID;
    }
    return out;
  }

  /**
   * Map an array of Data Store rows.
   * @param {object[]} rows
   * @returns {object[]}
   */
  static fromDataStoreMany(rows = []) {
    return (rows || []).map((r) => this.fromDataStore(r));
  }
}
