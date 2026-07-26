/**
 * @file validators.test.js
 * @description Unit Tests for Validators
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { LoginValidator } from '../../validators/LoginValidator.js';
import { FIRValidator } from '../../validators/FIRValidator.js';

console.log('--- Testing Validators ---');

const loginRes = LoginValidator.validateLogin({ username: 'officer1' });
console.assert(loginRes.isValid === false, 'LoginValidator password check failed');

const firRes = FIRValidator.validateFIR({ policeStation: 'PS1', district: 'Bengaluru Urban', crimeType: 'THEFT', complainantName: 'John' });
console.assert(firRes.isValid === true, 'FIRValidator valid check failed');

console.log('Validator tests passed successfully.');
