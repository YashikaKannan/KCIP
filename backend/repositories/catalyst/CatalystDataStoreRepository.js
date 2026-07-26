/**
 * @file CatalystDataStoreRepository.js
 * @description Base Concrete Catalyst Data Store Repository.
 *              Implements CRUD, ZQL search, pagination, filtering, and aggregation.
 *              All derived Catalyst repositories inherit from this class.
 * @module KCIP/Backend/Repositories/Catalyst
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.1.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from '../BaseRepository.js';
import { PaginationUtil } from '../../utils/pagination.js';
import { LoggerUtil } from '../../utils/logger.js';
import { repositoryConfig } from '../../config/repositoryConfig.js';

export class CatalystDataStoreRepository extends BaseRepository {
  /**
   * @param {string} tableName    - Catalyst Data Store table name (case-sensitive)
   * @param {object} catalystApp  - Initialised Catalyst App instance (may be null offline)
   */
  constructor(tableName, catalystApp = null) {
    super();
    this.tableName = tableName;
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

  /**
   * Escape a value for safe inclusion in a ZQL literal.
   * @param {*} value
   * @returns {string}
   */
  _escape(value) {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    const str = String(value).replace(/'/g, "''");
    return `'${str}'`;
  }

  /**
   * Validate column identifiers used in dynamic ZQL (letters, digits, underscore only).
   * @param {string} column
   * @returns {string}
   */
  _safeColumn(column) {
    const name = String(column || '').trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      throw new Error(`Invalid column name for ZQL: ${column}`);
    }
    return name;
  }

  /**
   * Build a ZQL WHERE clause from a filter object.
   * Supports equality and operators via `{ field: { $eq|$ne|$gt|$gte|$lt|$lte|$like|$in: value } }`.
   * @param {object|string} filter
   * @returns {string} WHERE clause without the WHERE keyword, or empty string
   */
  _buildWhere(filter = {}) {
    if (!filter) return '';
    if (typeof filter === 'string') return filter.trim();

    const clauses = [];
    for (const [key, raw] of Object.entries(filter)) {
      if (raw === undefined) continue;
      const col = this._safeColumn(key);

      if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
        if ('$eq' in raw) clauses.push(`${col} = ${this._escape(raw.$eq)}`);
        else if ('$ne' in raw) clauses.push(`${col} != ${this._escape(raw.$ne)}`);
        else if ('$gt' in raw) clauses.push(`${col} > ${this._escape(raw.$gt)}`);
        else if ('$gte' in raw) clauses.push(`${col} >= ${this._escape(raw.$gte)}`);
        else if ('$lt' in raw) clauses.push(`${col} < ${this._escape(raw.$lt)}`);
        else if ('$lte' in raw) clauses.push(`${col} <= ${this._escape(raw.$lte)}`);
        else if ('$like' in raw) clauses.push(`${col} LIKE ${this._escape(raw.$like)}`);
        else if ('$in' in raw && Array.isArray(raw.$in) && raw.$in.length) {
          const list = raw.$in.map((v) => this._escape(v)).join(', ');
          clauses.push(`${col} IN (${list})`);
        }
        continue;
      }

      clauses.push(`${col} = ${this._escape(raw)}`);
    }

    return clauses.join(' AND ');
  }

  /**
   * Normalise ZQL result rows to plain objects for this table.
   * @param {Array} result
   * @returns {object[]}
   */
  _mapRows(result) {
    return (result ?? []).map((r) => {
      if (r && typeof r === 'object' && r[this.tableName]) return r[this.tableName];
      return r;
    });
  }

  /**
   * Execute a ZQL SELECT and map rows.
   * @param {string} query
   * @returns {Promise<object[]>}
   */
  async _executeSelect(query) {
    const zql = this._zql();
    if (!zql) return [];
    try {
      const result = await zql.executeZQLQuery(query);
      return this._mapRows(result);
    } catch (err) {
      LoggerUtil.error(`[DataStore] ZQL failed [${this.tableName}]`, {
        query,
        error: err.message
      });
      throw err;
    }
  }

  // ── CRUD Operations ────────────────────────────────────────────────────────

  /**
   * Find a single row by its ROWID.
   * @param {string|number} id - Row ID
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const ds = this._ds();
    if (!ds) {
      return { ROWID: id, id, tableName: this.tableName, _offline: true };
    }
    try {
      const row = await ds.table(this.tableName).getRow(id);
      return row ?? null;
    } catch (err) {
      LoggerUtil.warn(`[DataStore] findById [${this.tableName}]`, { id, error: err.message });
      // Fall back to ZQL if getRow fails
      try {
        const rows = await this.search({ ROWID: id });
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
  }

  /**
   * Retrieve rows with optional filter, search text, sort, and pagination.
   * @param {object} [options]
   * @param {object|string} [options.filter]
   * @param {string} [options.search] - Free-text search applied to searchFields
   * @param {string[]} [options.searchFields]
   * @param {string} [options.sortBy]
   * @param {'asc'|'desc'} [options.sortOrder]
   * @param {number} [options.page]
   * @param {number} [options.pageSize]
   * @param {number} [options.limit]
   * @param {number} [options.offset]
   * @returns {Promise<{ data: object[], page: number, pageSize: number, total: number }|object[]>}
   */
  async findAll(options = {}) {
    const {
      filter = {},
      search: searchText,
      searchFields = [],
      sortBy,
      sortOrder = 'asc',
      page,
      pageSize,
      limit,
      offset,
      paginated = true
    } = options;

    const zql = this._zql();
    if (!zql) {
      const offlineRow = { id: 'offline-1', tableName: this.tableName, _offline: true };
      if (paginated === false) return [offlineRow];
      return {
        data: [offlineRow],
        page: 1,
        pageSize: repositoryConfig.defaultPageSize,
        total: 1,
        _offline: true
      };
    }

    const whereParts = [];
    const filterClause = this._buildWhere(filter);
    if (filterClause) whereParts.push(filterClause);

    if (searchText && searchFields.length) {
      const like = this._escape(`%${searchText}%`);
      const orParts = searchFields.map((f) => `${this._safeColumn(f)} LIKE ${like}`);
      whereParts.push(`(${orParts.join(' OR ')})`);
    }

    const whereSql = whereParts.length ? ` WHERE ${whereParts.join(' AND ')}` : '';

    let orderSql = '';
    if (sortBy) {
      const dir = String(sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      orderSql = ` ORDER BY ${this._safeColumn(sortBy)} ${dir}`;
    }

    const paging = PaginationUtil.getParams(
      page ?? 1,
      pageSize ?? limit ?? repositoryConfig.defaultPageSize
    );
    const start = offset !== undefined ? offset : paging.offset;
    const size = limit !== undefined ? Math.min(repositoryConfig.maxPageSize, limit) : paging.pageSize;
    const limitSql = ` LIMIT ${start}, ${size}`;

    try {
      const [data, total] = await Promise.all([
        this._executeSelect(`SELECT * FROM ${this.tableName}${whereSql}${orderSql}${limitSql}`),
        this.count(filterClause || filter)
      ]);

      if (paginated === false) return data;

      return {
        data,
        page: paging.page,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size) || 0
      };
    } catch (err) {
      LoggerUtil.warn(`[DataStore] findAll fallback [${this.tableName}]`, { error: err.message });
      if (paginated === false) return [];
      return { data: [], page: 1, pageSize: size, total: 0, totalPages: 0 };
    }
  }

  /**
   * Insert a new row.
   * @param {object} data - Row data (column → value map)
   * @returns {Promise<object>} Inserted row with ROWID
   */
  async create(data) {
    const ds = this._ds();
    if (!ds) {
      return { ROWID: `offline-${Date.now()}`, ...data, _offline: true };
    }
    try {
      const payload = { ...data };
      delete payload.ROWID;
      delete payload.id;
      return await ds.table(this.tableName).insertRow(payload);
    } catch (err) {
      LoggerUtil.error(`[DataStore] create failed [${this.tableName}]`, { error: err.message });
      throw err;
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
    if (!ds) {
      return { ROWID: id, ...data, _offline: true };
    }
    try {
      const payload = { ROWID: id, ...data };
      delete payload.id;
      return await ds.table(this.tableName).updateRow(payload);
    } catch (err) {
      LoggerUtil.error(`[DataStore] update failed [${this.tableName}]`, { id, error: err.message });
      throw err;
    }
  }

  /**
   * Delete a row by ROWID.
   * @param {string|number} id - Row ID
   * @returns {Promise<{ deleted: boolean, id: string|number }>}
   */
  async delete(id) {
    const ds = this._ds();
    if (!ds) {
      return { deleted: true, id, _offline: true };
    }
    try {
      await ds.table(this.tableName).deleteRow(id);
      return { deleted: true, id };
    } catch (err) {
      LoggerUtil.error(`[DataStore] delete failed [${this.tableName}]`, { id, error: err.message });
      throw err;
    }
  }

  // ── Query Operations ───────────────────────────────────────────────────────

  /**
   * Search rows using a filter object or raw ZQL WHERE clause.
   * @param {object|string} filterOrWhere - Filter map or WHERE clause body
   * @param {object} [options] - Optional sort/limit
   * @returns {Promise<object[]>}
   */
  async search(filterOrWhere, options = {}) {
    const where = typeof filterOrWhere === 'string'
      ? filterOrWhere
      : this._buildWhere(filterOrWhere);

    if (!where) {
      const result = await this.findAll({ ...options, paginated: false });
      return Array.isArray(result) ? result : result.data;
    }

    const zql = this._zql();
    if (!zql) return [];

    let orderSql = '';
    if (options.sortBy) {
      const dir = String(options.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      orderSql = ` ORDER BY ${this._safeColumn(options.sortBy)} ${dir}`;
    }

    let limitSql = '';
    if (options.limit !== undefined) {
      const start = options.offset ?? 0;
      const size = Math.min(repositoryConfig.maxPageSize, Number(options.limit) || repositoryConfig.defaultPageSize);
      limitSql = ` LIMIT ${start}, ${size}`;
    }

    try {
      return await this._executeSelect(
        `SELECT * FROM ${this.tableName} WHERE ${where}${orderSql}${limitSql}`
      );
    } catch (err) {
      LoggerUtil.warn(`[DataStore] search fallback [${this.tableName}]`, { error: err.message });
      return [];
    }
  }

  /**
   * Find the first row matching a filter.
   * @param {object|string} filter
   * @returns {Promise<object|null>}
   */
  async findOne(filter) {
    const rows = await this.search(filter, { limit: 1 });
    return rows[0] ?? null;
  }

  /**
   * Find rows where a column equals a value.
   * @param {string} field
   * @param {*} value
   * @returns {Promise<object[]>}
   */
  async findByField(field, value) {
    return this.search({ [field]: value });
  }

  /**
   * Count total rows, optionally filtered.
   * @param {object|string} [filter]
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    const zql = this._zql();
    if (!zql) return 0;

    const where = typeof filter === 'string' ? filter : this._buildWhere(filter);
    const whereSql = where ? ` WHERE ${where}` : '';

    try {
      const result = await zql.executeZQLQuery(
        `SELECT COUNT(ROWID) FROM ${this.tableName}${whereSql}`
      );
      const row = result?.[0];
      if (!row) return 0;
      // Catalyst may nest under table name or expose COUNT / COUNT(ROWID)
      const nested = row[this.tableName] ?? row;
      return Number(
        nested.COUNT
        ?? nested['COUNT(ROWID)']
        ?? nested.count
        ?? Object.values(nested)[0]
        ?? 0
      );
    } catch (err) {
      LoggerUtil.warn(`[DataStore] count fallback [${this.tableName}]`, { error: err.message });
      return 0;
    }
  }

  /**
   * Bulk insert multiple rows.
   * @param {object[]} rows - Array of row data objects
   * @returns {Promise<object[]>} Inserted rows
   */
  async bulkInsert(rows = []) {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const ds = this._ds();
    if (!ds) {
      return rows.map((r) => ({ ROWID: `offline-${Date.now()}`, ...r, _offline: true }));
    }
    try {
      const payload = rows.map((r) => {
        const copy = { ...r };
        delete copy.ROWID;
        delete copy.id;
        return copy;
      });
      return await ds.table(this.tableName).insertRows(payload);
    } catch (err) {
      LoggerUtil.error(`[DataStore] bulkInsert failed [${this.tableName}]`, { error: err.message });
      throw err;
    }
  }

  /**
   * Simple aggregation via ZQL GROUP BY.
   * @param {object} pipeline
   * @param {string} pipeline.groupBy - Column to group by
   * @param {string} [pipeline.aggregate='COUNT'] - Aggregate function (COUNT|SUM|AVG|MIN|MAX)
   * @param {string} [pipeline.field='ROWID'] - Field for SUM/AVG/MIN/MAX
   * @param {object|string} [pipeline.filter]
   * @returns {Promise<object[]>}
   */
  async aggregate(pipeline = {}) {
    const {
      groupBy,
      aggregate = 'COUNT',
      field = 'ROWID',
      filter = {}
    } = pipeline;

    if (!groupBy) {
      throw new Error('aggregate() requires pipeline.groupBy');
    }

    const zql = this._zql();
    if (!zql) return [];

    const fn = String(aggregate).toUpperCase();
    if (!['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(fn)) {
      throw new Error(`Unsupported aggregate function: ${aggregate}`);
    }

    const groupCol = this._safeColumn(groupBy);
    const valueCol = this._safeColumn(field);
    const where = typeof filter === 'string' ? filter : this._buildWhere(filter);
    const whereSql = where ? ` WHERE ${where}` : '';
    const alias = `${fn}_${valueCol}`;

    try {
      const query =
        `SELECT ${groupCol}, ${fn}(${valueCol}) AS ${alias} ` +
        `FROM ${this.tableName}${whereSql} GROUP BY ${groupCol}`;
      return await this._executeSelect(query);
    } catch (err) {
      LoggerUtil.warn(`[DataStore] aggregate fallback [${this.tableName}]`, { error: err.message });
      return [];
    }
  }
}
