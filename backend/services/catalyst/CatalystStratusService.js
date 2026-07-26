/**
 * @file CatalystStratusService.js
 * @description Zoho Catalyst Stratus object storage adapter for evidence uploads
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';

export class CatalystStratusService {
  /**
   * @param {object|null} catalystApp
   * @param {string} [defaultBucket]
   */
  constructor(catalystApp = null, defaultBucket = 'kcip-evidence') {
    this.catalystApp = catalystApp;
    this.defaultBucket = defaultBucket || process.env.KCIP_STRATUS_BUCKET || 'kcip-evidence';
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
  }

  /**
   * Upload evidence file bytes/base64 to Stratus and return a public/signed URL.
   * @param {object} input
   * @param {string} input.fileName
   * @param {string} [input.fileType]
   * @param {string|Buffer} input.fileContent - raw string, base64, or Buffer
   * @param {string} [input.bucketName]
   * @param {string} [input.firNumber]
   * @returns {Promise<object>}
   */
  async uploadEvidence(input = {}) {
    const {
      fileName,
      fileType = 'application/octet-stream',
      fileContent,
      bucketName = this.defaultBucket,
      firNumber
    } = input;

    if (!fileName || fileContent === undefined || fileContent === null) {
      throw new Error('fileName and fileContent are required for evidence upload.');
    }

    const objectKey = [
      firNumber ? `fir/${firNumber}` : 'misc',
      `${Date.now()}-${fileName}`
    ].join('/');

    try {
      if (this.catalystApp && typeof this.catalystApp.stratus === 'function') {
        const stratus = this.catalystApp.stratus();
        const bucket = typeof stratus.bucket === 'function'
          ? stratus.bucket(bucketName)
          : null;

        if (bucket && typeof bucket.putObject === 'function') {
          const buffer = Buffer.isBuffer(fileContent)
            ? fileContent
            : Buffer.from(String(fileContent), this._looksBase64(fileContent) ? 'base64' : 'utf8');

          const uploaded = await bucket.putObject(objectKey, buffer, {
            contentType: fileType
          });

          const url =
            uploaded?.url ||
            uploaded?.object_url ||
            (typeof bucket.getObjectUrl === 'function'
              ? await bucket.getObjectUrl(objectKey)
              : `stratus://${bucketName}/${objectKey}`);

          LoggerUtil.info('[Stratus] Evidence uploaded', { bucketName, objectKey });
          return {
            success: true,
            bucketName,
            objectKey,
            fileName,
            fileType,
            firNumber: firNumber || null,
            url,
            uploadedAt: new Date().toISOString()
          };
        }
      }
    } catch (error) {
      LoggerUtil.error('[Stratus] Upload failed', { error: error.message, objectKey });
      throw error;
    }

    // Offline / local fallback — do not crash callers
    const offlineUrl = `stratus-offline://${bucketName}/${objectKey}`;
    LoggerUtil.warn('[Stratus] Offline fallback URL issued', { objectKey });
    return {
      success: true,
      bucketName,
      objectKey,
      fileName,
      fileType,
      firNumber: firNumber || null,
      url: offlineUrl,
      uploadedAt: new Date().toISOString(),
      _offline: true
    };
  }

  _looksBase64(value) {
    if (typeof value !== 'string') return false;
    if (value.startsWith('data:')) return true;
    return /^[A-Za-z0-9+/=\r\n]+$/.test(value) && value.length > 64;
  }
}
