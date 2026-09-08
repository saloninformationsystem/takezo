/**
 * =================================================================
 * Salon Information System (SIS) - js/storage.js
 * [役割: ローカルストレージ・キャッシュ操作専門]
 * =================================================================
 */

/**
 * 1. 保存済みのお客様情報を取得する
 * @returns {Object} 保存済みのお客様情報
 */
function getCachedCustomerData() {
  const result = {};

  try {
    if (typeof CONFIG === "undefined" || !Array.isArray(CONFIG.STORAGE_FIELDS)) {
      return result;
    }

    CONFIG.STORAGE_FIELDS.forEach(field => {
      const saved = localStorage.getItem(`${CONFIG.STORAGE_PREFIX}${field}`);
      if (saved) {
        result[field] = saved;
      }
    });
  } catch (e) {
    console.warn("ローカルストレージからのデータ取得に失敗しました:", e);
  }

  return result;
}

/**
 * 2. 指定されたお客様情報をローカルストレージに保存する
 * @param {Object} data - 保存対象データ
 */
function saveCustomerDataToCache(data) {
  try {
    if (typeof CONFIG === "undefined" || !Array.isArray(CONFIG.STORAGE_FIELDS)) {
      return;
    }

    CONFIG.STORAGE_FIELDS.forEach(field => {
      const value = data[field];

      if (value && String(value).trim()) {
        localStorage.setItem(`${CONFIG.STORAGE_PREFIX}${field}`, String(value).trim());
      } else {
        localStorage.removeItem(`${CONFIG.STORAGE_PREFIX}${field}`);
      }
    });
  } catch (e) {
    console.warn("ローカルストレージへのデータ保存に失敗しました:", e);
  }
}
