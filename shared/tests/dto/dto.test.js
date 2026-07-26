/**
 * @file dto.test.js
 * @description Unit Tests for DTO Structures
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { LoginRequestDTO } from '../../dto/LoginRequest.js';
import { RegisterFIRRequestDTO } from '../../dto/RegisterFIRRequest.js';

console.log('--- Testing DTOs ---');

console.assert(Object.isFrozen(LoginRequestDTO), 'LoginRequestDTO must be frozen');
console.assert(Object.isFrozen(RegisterFIRRequestDTO), 'RegisterFIRRequestDTO must be frozen');

console.log('DTO tests passed successfully.');
