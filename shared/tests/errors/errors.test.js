/**
 * @file errors.test.js
 * @description Unit Tests for Custom Error Classes
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from '../../errors/AppError.js';
import { ValidationError } from '../../errors/ValidationError.js';

console.log('--- Testing Errors ---');

const err = new ValidationError('Invalid Field');
console.assert(err instanceof AppError, 'ValidationError must extend AppError');
console.assert(err.statusCode === 400, 'ValidationError status code must be 400');

console.log('Error tests passed successfully.');
