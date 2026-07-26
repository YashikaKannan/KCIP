/**
 * @file GraphModel.js
 * @description Crime Network Graph Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class GraphModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.nodes = data.nodes || null;
    this.edges = data.edges || null;
    this.summary = data.summary || null;
  }
}
