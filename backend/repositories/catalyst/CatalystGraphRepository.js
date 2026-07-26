/**
 * @file CatalystGraphRepository.js
 * @description Catalyst Crime Network Graph Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';
import { LoggerUtil } from '../../utils/logger.js';

export class CatalystGraphRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Accused', catalystApp);
  }

  /**
   * Build a crime-association network rooted at an accused / FIR / victim id.
   * Returns Cytoscape-compatible { nodes, edges }.
   * @param {string} rootId
   * @param {number} [depth=2]
   * @returns {Promise<{ nodes: object[], edges: object[], summary: object }>}
   */
  async getNetworkByRootId(rootId, depth = 2) {
    const zql = this._zql();
    const nodes = new Map();
    const edges = [];

    const addNode = (id, label, type, data = {}) => {
      if (!id || nodes.has(id)) return;
      nodes.set(id, { data: { id: String(id), label, type, ...data } });
    };

    const addEdge = (source, target, label, type) => {
      if (!source || !target) return;
      const id = `${source}->${target}:${type}`;
      edges.push({ data: { id, source: String(source), target: String(target), label, type } });
    };

    if (!zql) {
      addNode(rootId, rootId, 'ROOT', { _offline: true });
      return {
        nodes: [...nodes.values()],
        edges,
        summary: { nodeCount: 1, edgeCount: 0, depth, rootId, _offline: true }
      };
    }

    try {
      const maxDepth = Math.min(Math.max(Number(depth) || 2, 1), 4);
      let firNumbers = new Set();
      let accusedRows = [];
      let victimRows = [];

      // Resolve root: try Accused ROWID / Name, then FIRNumber
      const accusedById = await this.findById(rootId).catch(() => null);
      if (accusedById && !accusedById._offline) {
        accusedRows = [accusedById];
        if (accusedById.FIRNumber) firNumbers.add(accusedById.FIRNumber);
      } else {
        const byFir = await this.findByField('FIRNumber', rootId);
        if (byFir.length) {
          accusedRows = byFir;
          firNumbers.add(rootId);
        } else {
          const byName = await this.search({ Name: rootId });
          accusedRows = byName;
          byName.forEach((a) => a.FIRNumber && firNumbers.add(a.FIRNumber));
        }
      }

      if (!firNumbers.size && accusedRows.length === 0) {
        firNumbers.add(rootId);
      }

      // Expand related FIRs / accused / victims up to depth
      for (let d = 0; d < maxDepth; d += 1) {
        const currentFirs = [...firNumbers];
        if (!currentFirs.length) break;

        const list = currentFirs.slice(0, 40).map((f) => this._escape(f)).join(', ');

        const [moreAccused, moreVictims, firRows] = await Promise.all([
          this._safeZql(`SELECT * FROM Accused WHERE FIRNumber IN (${list})`),
          this._safeZql(`SELECT * FROM Victims WHERE FIRNumber IN (${list})`),
          this._safeZql(`SELECT * FROM FIRs WHERE FIRNumber IN (${list})`)
        ]);

        accusedRows = this._mergeByRowId(accusedRows, moreAccused.map((r) => r.Accused ?? r));
        victimRows = this._mergeByRowId(victimRows, moreVictims.map((r) => r.Victims ?? r));

        for (const fir of firRows) {
          const row = fir.FIRs ?? fir;
          if (row.FIRNumber) firNumbers.add(row.FIRNumber);
          addNode(`case:${row.FIRNumber}`, row.FIRNumber, 'CASE', {
            district: row.District,
            policeStation: row.PoliceStation,
            crimeType: row.CrimeType,
            status: row.Status
          });
          if (row.PoliceStation) {
            addNode(`ps:${row.PoliceStation}`, row.PoliceStation, 'POLICE_STATION', {
              district: row.District
            });
            addEdge(`case:${row.FIRNumber}`, `ps:${row.PoliceStation}`, 'filed_at', 'ASSOCIATED_STATION');
          }
        }

        // Expand via shared accused names (repeat offenders) for next depth
        for (const acc of accusedRows) {
          if (!acc.Name) continue;
          const sameName = await this.search({ Name: acc.Name }, { limit: 20 });
          for (const s of sameName) {
            if (s.FIRNumber) firNumbers.add(s.FIRNumber);
          }
        }
      }

      // Materialise accused / victim nodes + edges
      for (const acc of accusedRows) {
        const nodeId = `accused:${acc.ROWID || acc.Name}`;
        addNode(nodeId, acc.Name || acc.Alias || 'Accused', 'ACCUSED', {
          riskLevel: acc.RiskLevel,
          status: acc.Status,
          firNumber: acc.FIRNumber
        });
        if (acc.FIRNumber) {
          addEdge(nodeId, `case:${acc.FIRNumber}`, 'accused_in', 'ASSOCIATED_CASE');
        }
      }

      for (const vic of victimRows) {
        const nodeId = `victim:${vic.ROWID || vic.Name}`;
        addNode(nodeId, vic.Name || 'Victim', 'VICTIM', {
          firNumber: vic.FIRNumber,
          gender: vic.Gender
        });
        if (vic.FIRNumber) {
          addEdge(nodeId, `case:${vic.FIRNumber}`, 'victim_in', 'ASSOCIATED_CASE');
        }
      }

      // Repeat-offender edges (same name, different FIRs)
      const byName = new Map();
      for (const acc of accusedRows) {
        const key = String(acc.Name || '').trim().toLowerCase();
        if (!key) continue;
        if (!byName.has(key)) byName.set(key, []);
        byName.get(key).push(acc);
      }
      for (const group of byName.values()) {
        if (group.length < 2) continue;
        for (let i = 0; i < group.length - 1; i += 1) {
          const a = `accused:${group[i].ROWID || group[i].Name}`;
          const b = `accused:${group[i + 1].ROWID || group[i + 1].Name}`;
          addEdge(a, b, 'same_identity', 'REPEAT_OFFENDER');
        }
      }

      // Shared victims (same name across FIRs)
      const victimsByName = new Map();
      for (const vic of victimRows) {
        const key = String(vic.Name || '').trim().toLowerCase();
        if (!key) continue;
        if (!victimsByName.has(key)) victimsByName.set(key, []);
        victimsByName.get(key).push(vic);
      }
      for (const group of victimsByName.values()) {
        const firs = [...new Set(group.map((g) => g.FIRNumber).filter(Boolean))];
        if (firs.length < 2) continue;
        for (let i = 0; i < firs.length - 1; i += 1) {
          addEdge(`case:${firs[i]}`, `case:${firs[i + 1]}`, 'shared_victim', 'SHARED_VICTIM');
        }
      }

      // Cross-district edges
      const caseNodes = [...nodes.values()].filter((n) => n.data.type === 'CASE');
      const districts = new Map();
      for (const n of caseNodes) {
        const d = n.data.district;
        if (!d) continue;
        if (!districts.has(d)) districts.set(d, []);
        districts.get(d).push(n.data.id);
      }
      if (districts.size > 1) {
        const districtNames = [...districts.keys()];
        for (let i = 0; i < districtNames.length - 1; i += 1) {
          const aCases = districts.get(districtNames[i]);
          const bCases = districts.get(districtNames[i + 1]);
          if (aCases[0] && bCases[0]) {
            addEdge(aCases[0], bCases[0], 'cross_district', 'CROSS_DISTRICT');
          }
        }
      }

      if (!nodes.has(rootId) && !nodes.has(`accused:${rootId}`) && !nodes.has(`case:${rootId}`)) {
        addNode(rootId, String(rootId), 'ROOT');
      }

      return {
        nodes: [...nodes.values()],
        edges,
        summary: {
          nodeCount: nodes.size,
          edgeCount: edges.length,
          depth: maxDepth,
          rootId,
          firCount: firNumbers.size,
          accusedCount: accusedRows.length,
          victimCount: victimRows.length
        }
      };
    } catch (err) {
      LoggerUtil.error('[GraphRepository] getNetworkByRootId failed', { rootId, error: err.message });
      addNode(rootId, String(rootId), 'ROOT', { error: err.message });
      return {
        nodes: [...nodes.values()],
        edges,
        summary: { nodeCount: nodes.size, edgeCount: 0, depth, rootId, error: err.message }
      };
    }
  }

  async _safeZql(query) {
    const zql = this._zql();
    if (!zql) return [];
    try {
      return (await zql.executeZQLQuery(query)) ?? [];
    } catch (err) {
      LoggerUtil.warn('[GraphRepository] ZQL query failed', { error: err.message });
      return [];
    }
  }

  _mergeByRowId(existing, incoming) {
    const map = new Map();
    for (const row of [...existing, ...incoming]) {
      const key = row.ROWID || `${row.Name}:${row.FIRNumber}`;
      map.set(key, row);
    }
    return [...map.values()];
  }
}
