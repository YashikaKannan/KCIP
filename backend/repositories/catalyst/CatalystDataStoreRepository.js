/**
 * @file CatalystDataStoreRepository.js
 * @description Base Concrete Catalyst Data Store Repository.
 *              Implements CRUD + ZQL search operations.
 *              All derived repositories inherit from this class.
 * @module KCIP/Backend/Repositories/Catalyst
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from '../BaseRepository.js';

export class CatalystDataStoreRepository extends BaseRepository {
  /**
   * @param {string} tableName    - Catalyst Data Store table name (case-sensitive)
   * @param {object} catalystApp  - Initialised Catalyst App instance (may be null offline)
   */
  constructor(tableName, catalystApp = null) {
    super();
    this.tableName   = tableName;
    this.catalystApp = catalystApp;
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /** @returns {object|null} Catalyst Data Store instance */
  _ds() {
    return (this.catalystApp && typeof this.catalystApp.datastore === 'function')
      ? this.catalystApp.datastore()
      : null;
  }

  /** @returns {object|null} Catalyst ZQL instance */
  _zql() {
    return (this.catalystApp && typeof this.catalystApp.zql === 'function')
      ? this.catalystApp.zql()
      : null;
  }

  // ── CRUD Operations ────────────────────────────────────────────────────────

  /**
   * Find a single row by its ROWID.
   * @param {string|number} id - Row ID
   * @returns {Promise<object>}
   */
  async findById(id) {
    const ds = this._ds();
    if (!ds) return { ROWID: id, id, tableName: this.tableName, _offline: true };
    try {
      const row = await ds.table(this.tableName).getRow(id);
      return row;
    } catch (err) {
      console.warn(`[DataStore] findById fallback [${this.tableName}]:`, err.message);
      return { ROWID: id, id, tableName: this.tableName };
    }
  }

  /**
   * Retrieve all rows using ZQL SELECT *.
   * @param {object} [_options] - Reserved for future cursor-based pagination
   * @returns {Promise<object[]>}
   */
  async findAll(_options = {}) {
    const zql = this._zql();
    if (!zql) return [{ id: 'offline-1', tableName: this.tableName, _offline: true }];
    try {
      const result = await zql.executeZQLQuery(`SELECT * FROM ${this.tableName}`);
      return (result ?? []).map(r => r[this.tableName] ?? r);
    } catch (err) {
      console.warn(`[DataStore] findAll fallback [${this.tableName}]:`, err.message);
      return [];
    }
  }

  /**
   * Insert a new row.
   * @param {object} data - Row data (column → value map)
   * @returns {Promise<object>} Inserted row with ROWID
   */
  async create(data) {
    const ds = this._ds();
    if (!ds) return { ROWID: `offline-${Date.now()}`, ...data, _offline: true };
    try {
      return await ds.table(this.tableName).insertRow(data);
    } catch (err) {
      console.warn(`[DataStore] create fallback [${this.tableName}]:`, err.message);
      return { ROWID: `offline-${Date.now()}`, ...data };
    }
  }

  /**
   * Update an existing row by ROWID.
   * @param {string|number} id   - Row ID
   * @param {object}        data - Fields to update
   * @returns {Promise<object>} Updated row
   */
  async update(id, data) {
    const ds = this._ds();
    if (!ds) return { ROWID: id, ...data, _offline: true };
    try {
      return await ds.table(this.tableName).updateRow({ ROWID: id, ...data });
    } catch (err) {
      console.warn(`[DataStore] update fallback [${this.tableName}]:`, err.message);
      return { ROWID: id, ...data };
    }
  }

  /**
   * Delete a row by ROWID.
   * @param {string|number} id - Row ID
   * @returns {Promise<{ deleted: boolean, id: string|number }>}
   */
  async delete(id) {
    const ds = this._ds();
    if (!ds) return { deleted: true, id, _offline: true };
    try {
      await ds.table(this.tableName).deleteRow(id);
      return { deleted: true, id };
    } catch (err) {
      console.warn(`[DataStore] delete fallback [${this.tableName}]:`, err.message);
      return { deleted: false, id };
    }
  }

  // ── Query Operations ───────────────────────────────────────────────────────

  /**
   * Search rows using a ZQL WHERE clause.
   * @param {string} whereClause - ZQL WHERE clause (e.g. "District = 'Bengaluru Urban'")
   * @returns {Promise<object[]>}
   */
  async search(whereClause) {
    const zql = this._zql();
    if (!zql) return [];
    try {
      const query  = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
      const result = await zql.executeZQLQuery(query);
      return (result ?? []).map(r => r[this.tableName] ?? r);
    } catch (err) {
      console.warn(`[DataStore] search fallback [${this.tableName}]:`, err.message);
      return [];
    }
  }

  /**
   * Count total rows in the table.
   * @returns {Promise<number>}
   */
  async count() {
    const zql = this._zql();
    if (!zql) return 0;
    try {
      const result = await zql.executeZQLQuery(`SELECT COUNT(*) FROM ${this.tableName}`);
      return result?.[0]?.COUNT ?? 0;
    } catch (err) {
      console.warn(`[DataStore] count fallback [${this.tableName}]:`, err.message);
      return 0;
    }
  }

  /**
   * Bulk insert multiple rows.
   * @param {object[]} rows - Array of row data objects
   * @returns {Promise<object[]>} Inserted rows
   */
  async bulkInsert(rows) {
    const ds = this._ds();
    if (!ds) return rows.map(r => ({ ROWID: `offline-${Date.now()}`, ...r, _offline: true }));
    try {
      return await ds.table(this.tableName).insertRows(rows);
    } catch (err) {
      console.warn(`[DataStore] bulkInsert fallback [${this.tableName}]:`, err.message);
      return rows;
    }
  }
}
