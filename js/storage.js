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
 * 3. 文字サイズの設定（100/115/130）をローカルストレージに保存する
 * @param {number} scale
 */
function saveFontScaleToCache(scale) {
  try {
    localStorage.setItem("sis_font_scale", String(scale));
  } catch (e) {
    console.warn("文字サイズ設定の保存に失敗しました:", e);
  }
}

/**
 * 4. 保存済みの文字サイズ設定を取得する（未保存の場合は100＝標準）
 * @returns {number}
 */
function getCachedFontScale() {
  try {
    const saved = localStorage.getItem("sis_font_scale");
    return saved ? parseInt(saved, 10) : 100;
  } catch (e) {
    return 100;
  }
}
