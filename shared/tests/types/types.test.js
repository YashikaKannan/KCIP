/**
 * @file types.test.js
 * @description Unit Tests for Entity Types
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { defaultUser, exampleUser } from '../../types/User.js';
import { defaultFIR, exampleFIR } from '../../types/FIR.js';

console.log('--- Testing Types ---');

console.assert(Object.isFrozen(defaultUser), 'defaultUser must be frozen');
console.assert(exampleUser.role === 'INVESTIGATION_OFFICER', 'exampleUser role check failed');
console.assert(Object.isFrozen(defaultFIR), 'defaultFIR must be frozen');

console.log('Types tests passed successfully.');
