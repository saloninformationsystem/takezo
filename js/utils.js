/**
 * =================================================================
 * Salon Information System (SIS) - js/utils.js
 * [役割: 共通関数（日付・文字列・表示整形など)]
 * =================================================================
 */

/**
 * 1. HTMLエスケープ
 * @param {string} value - 変換対象文字列
 * @returns {string} エスケープ後文字列
 */
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 2. yyyy-MM-dd を yyyy年M月d日 に変換
 * @param {string} dateStr - 日付文字列
 * @returns {string} 整形済み日付文字列
 */
function formatJapaneseDate(dateStr) {
  const parts = String(dateStr || "").split("-");
  if (parts.length !== 3) return String(dateStr || "");
  return `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`;
}

/**
 * 3. yyyy-MM-dd を M/d(曜) に変換
 * @param {string} dateStr - 日付文字列
 * @returns {string} 整形済み日付文字列
 */
function formatDateHeaderLabel(dateStr) {
  const cleanStr = String(dateStr || "").replace(/-/g, "/");
  const d = new Date(cleanStr);

  if (isNaN(d.getTime())) return String(dateStr || "");

  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${dayLabels[d.getDay()]})`;
}

/**
 * 2-2. 日付文字列から曜日番号を取得する（0:日, 1:月, ... 6:土）
 * タイムテーブルの曜日ごとの色分けなどで使う
 * @param {string} dateStr - 日付文字列 (yyyy-MM-dd または yyyy/MM/dd)
 * @returns {number} 曜日番号（無効な日付の場合は -1）
 */
function getDayOfWeekIndex(dateStr) {
  const cleanStr = String(dateStr || "").replace(/-/g, "/");
  const d = new Date(cleanStr);
  return isNaN(d.getTime()) ? -1 : d.getDay();
}

/**
 * 4. ローカル日付で yyyy-MM-dd を作成
 * @param {Date} dateObj - Dateオブジェクト
 * @returns {string} yyyy-MM-dd 形式
 */
function formatLocalDateInputValue(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 5. 今日から指定日数後の日付を yyyy-MM-dd で返す
 * @param {number} days - 加算日数
 * @returns {string} yyyy-MM-dd 形式
 */
function getLocalDateAfterDays(days) {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  return formatLocalDateInputValue(target);
}

/**
 * 5-2. 指定した日付（yyyy-MM-dd）に、指定日数を加算/減算した日付を返す
 * 「次の日程」「前の日程」ボタンで、表示中の日付を丸ごとずらすために使う
 * @param {string} dateStr - 基準日 (yyyy-MM-dd)
 * @param {number} days - 加算日数（マイナス指定で過去方向へずらせる）
 * @returns {string} yyyy-MM-dd 形式
 */
function addDaysToDateString(dateStr, days) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const target = new Date(year, month - 1, day + days);
  return formatLocalDateInputValue(target);
}

/**
 * 5-3. 予約日時が「キャンセル・変更の受付締切」を過ぎているかどうかを判定する
 * 例: 予約が「2026-08-11 09:00」でバッファが24時間なら、締切は「2026-08-10 09:00」。
 * 　　今がその締切を過ぎていれば true を返す
 * @param {string} dateStr - 予約日 (yyyy-MM-dd)
 * @param {string} timeStr - 予約時刻 ("09:00" のような形式)
 * @param {number} bufferHours - 予約の何時間前まで受け付けるか
 * @returns {boolean} 締切を過ぎていたら true
 */
function isReservationDeadlinePassed(dateStr, timeStr, bufferHours) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const [hour, minute] = String(timeStr).split(':').map(Number);

  const reservationDateTime = new Date(year, month - 1, day, hour, minute);
  const deadline = new Date(reservationDateTime.getTime() - Number(bufferHours) * 60 * 60 * 1000);

  return new Date() > deadline;
}

/**
 * 6. メニュー表示ラベルを作る
 * @param {string} menuName - メニュー名
 * @param {Object} menuData - メニューデータ
 * @returns {string} 表示ラベル
 */
function buildMenuLabel(menuName, menuData) {
  const safeName = String(menuName || "");
  const data = menuData || {};

  // 表示名の翻訳（i18n）が入力されていて、日本語以外が選ばれている場合は、そちらを使う
  // 未入力・日本語選択時は、今まで通り日本語のメニュー名をそのまま使う
  const displayName = (typeof currentLang !== 'undefined' && currentLang !== 'ja' && data.i18n && data.i18n[currentLang])
    ? data.i18n[currentLang]
    : safeName;

  const meta = [];

  if (CONFIG.SHOW_MENU_MINUTES && data.minutes) {
    meta.push(`${data.minutes}${t('unit_minutes')}${data.minutesApprox ? t('approx_suffix') : ""}`);
  }

  if (CONFIG.SHOW_MENU_PRICE && data.price !== undefined && data.price !== null) {
    meta.push(`￥${Number(data.price).toLocaleString()}${data.priceApprox ? t('approx_suffix') : ""}`);
  }

  if (meta.length === 0) return displayName;
  return `${displayName} (${meta.join(" / ")})`;
}

/**
 * 7. 予約変更モードかどうかを返す
 * @returns {boolean} 変更モードなら true
 */
function isChangeMode() {
  return Boolean(AppState.changeModeData);
}

/**
 * 8. お客様入力データを集める
 * @returns {Object} 入力値オブジェクト
 */
function collectCustomerInputValues() {
  return {
    name: document.getElementById("name") ? document.getElementById("name").value.trim() : "",
    name_kana: document.getElementById("name_kana") ? document.getElementById("name_kana").value.trim() : "",
    tel: document.getElementById("tel") ? document.getElementById("tel").value.trim() : "",
    email: document.getElementById("email") ? document.getElementById("email").value.trim() : ""
  };
}

/**
 * 9. キャッシュ済みお客様情報を画面に反映する
 */
function applyCachedCustomerDataToForm() {
  const cached = getCachedCustomerData();

  Object.keys(cached).forEach(field => {
    const el = document.getElementById(field);
    if (el) el.value = cached[field];
  });

  if (cached.tel) {
    const checkTel = document.getElementById("check-tel");
    if (checkTel) checkTel.value = cached.tel;
  }

  if (cached.email) {
    const checkEmail = document.getElementById("check-email");
    if (checkEmail) checkEmail.value = cached.email;
  }
}

/**
 * 10. フォーム入力内容をキャッシュ保存する
 */
function saveCurrentCustomerDataToCache() {
  saveCustomerDataToCache(collectCustomerInputValues());
}

/**
 * 11. 予約一覧カード内のメニュー表示用HTMLを作る
 * @param {string} menuValue - メニュー文字列
 * @returns {string} エスケープ済み文字列
 */
function buildReservationMenuHtml(menuValue) {
  return escapeHtml(menuValue || "");
}
