/**
 * @file response.js
 * @description Backend Response Builder Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class ResponseUtil {
  static success(data = null, message = 'Operation completed successfully', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static error(message = 'An error occurred', errorCode = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    return {
      success: false,
      statusCode,
      errorCode,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static paginated(items = [], total = 0, page = 1, pageSize = 20, message = 'Success') {
    const totalPages = Math.ceil(total / Math.max(1, pageSize));
    return {
      success: true,
      statusCode: 200,
      message,
      data: items,
      meta: { total, page, pageSize, totalPages },
      timestamp: new Date().toISOString()
    };
  }
}
