/**
 * @file serializer.js
 * @description Backend Serialization Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class SerializerUtil {
  static serialize(data) {
    return JSON.stringify(data);
  }

  static deserialize(jsonString, fallback = null) {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  }
}
