/**
 * @file helpers.test.js
 * @description Unit Tests for Helper Functions
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { DateHelper } from '../../helpers/DateHelper.js';
import { GeoHelper } from '../../helpers/GeoHelper.js';
import { ValidationHelper } from '../../helpers/ValidationHelper.js';

console.log('--- Testing Helpers ---');

const formatted = DateHelper.formatDate('2026-07-25');
console.assert(formatted === '2026-07-25', 'DateHelper.formatDate failed');

const dist = GeoHelper.distanceBetweenCoordinates(12.9716, 77.5946, 12.9352, 77.6245);
console.assert(dist > 0, 'GeoHelper distance failed');

console.assert(ValidationHelper.isEmail('test@ksp.gov.in'), 'ValidationHelper.isEmail failed');

console.log('Helper tests passed successfully.');
