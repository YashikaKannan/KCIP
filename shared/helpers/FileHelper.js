/**
 * @file FileHelper.js
 * @description Pure File Utility Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class FileHelper {
  static getFileExtension(filename = '') {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  static getMimeType(extension = '') {
    const mimeMap = {
      pdf: 'application/pdf',
      csv: 'text/csv',
      json: 'application/json',
      jpg: 'image/jpeg',
      png: 'image/png'
    };
    return mimeMap[extension.toLowerCase()] || 'application/octet-stream';
  }

  static formatFileSize(bytes = 0) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static isValidFileType(filename = '', allowedExtensions = []) {
    const ext = this.getFileExtension(filename).toLowerCase();
    return allowedExtensions.map(e => e.toLowerCase()).includes(ext);
  }
}
