/**
 * @file ResponseHelper.js
 * @description API Standardized Response Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class ResponseHelper {
  static successResponse(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static errorResponse(message = 'Error', errorCode = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    return {
      success: false,
      statusCode,
      errorCode,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static paginatedResponse(items = [], total = 0, page = 1, pageSize = 20, message = 'Success') {
    const totalPages = Math.ceil(total / pageSize) || 1;
    return {
      success: true,
      statusCode: 200,
      message,
      data: items,
      meta: {
        total,
        page,
        pageSize,
        totalPages
      },
      timestamp: new Date().toISOString()
    };
  }
}
