/**
 * @file GeoHelper.js
 * @description Pure Reusable Geospatial Distance and Boundary Utilities
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class GeoHelper {
  static distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static isPointInBoundingBox(lat, lon, bbox) {
    const { minLat, maxLat, minLon, maxLon } = bbox;
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }

  static calculateBoundingBox(centerLat, centerLon, radiusKm) {
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos(centerLat * (Math.PI / 180)));
    return {
      minLat: centerLat - latDelta,
      maxLat: centerLat + latDelta,
      minLon: centerLon - lonDelta,
      maxLon: centerLon + lonDelta
    };
  }

  static formatCoordinates(lat, lon) {
    return `${Number(lat).toFixed(6)}, ${Number(lon).toFixed(6)}`;
  }

  static isValidCoordinate(lat, lon) {
    return typeof lat === 'number' && typeof lon === 'number' && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }
}
