/**
 * =================================================================
 * Salon Information System (SIS) - js/admin.js [Version 1.0.0]
 * [役割: 管理画面のログイン・セッション維持・ログアウト]
 * =================================================================
 */

const SESSION_TOKEN_KEY = 'sis_admin_token';
const SESSION_DISPLAY_NAME_KEY = 'sis_admin_display_name';

const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const adminLoginIdInput = document.getElementById('admin-login-id');
const adminPasswordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');

const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
const backToLoginBtn = document.getElementById('back-to-login-btn');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotEmailInput = document.getElementById('forgot-email');
const forgotPasswordError = document.getElementById('forgot-password-error');
const forgotPasswordSentMsg = document.getElementById('forgot-password-sent-msg');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');

const resetPasswordForm = document.getElementById('reset-password-form');
const resetNewPasswordInput = document.getElementById('reset-new-password');
const resetPasswordError = document.getElementById('reset-password-error');
const resetPasswordDoneMsg = document.getElementById('reset-password-done-msg');
const resetPasswordBtn = document.getElementById('reset-password-btn');

const reportStartDateInput = document.getElementById('report-start-date');
const reportEndDateInput = document.getElementById('report-end-date');
const runReportBtn = document.getElementById('run-report-btn');
const reportError = document.getElementById('report-error');
const reportResults = document.getElementById('report-results');
const designationSummary = document.getElementById('designation-summary');
const designationByStaff = document.getElementById('designation-by-staff');
const menuPerformanceTbody = document.getElementById('menu-performance-tbody');
const menuRateTbody = document.getElementById('menu-rate-tbody');
const quickRangeButtons = document.querySelectorAll('.btn-quick-range');
const reportTypeSelect = document.getElementById('report-type-select');
const designationReportCard = document.getElementById('designation-report-card');
const menuCountReportCard = document.getElementById('menu-count-report-card');
const menuRateReportCard = document.getElementById('menu-rate-report-card');
const timeSlotReportCard = document.getElementById('time-slot-report-card');
const newRepeatReportCard = document.getElementById('new-repeat-report-card');
const frequencyReportCard = document.getElementById('frequency-report-card');
const dormantReportCard = document.getElementById('dormant-report-card');
const cancellationReportCard = document.getElementById('cancellation-report-card');
const cancellationSummary = document.getElementById('cancellation-summary');
const cancellationBreakdown = document.getElementById('cancellation-breakdown');
const dateRangeControls = document.getElementById('date-range-controls');
const dormantControls = document.getElementById('dormant-controls');
const dormantMonthsInput = document.getElementById('dormant-months-input');
const timeSlotTableWrap = document.getElementById('time-slot-table-wrap');
const newRepeatSummary = document.getElementById('new-repeat-summary');
const frequencySummary = document.getElementById('frequency-summary');
const dormantCountLabel = document.getElementById('dormant-count-label');
const dormantTbody = document.getElementById('dormant-tbody');

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPages = document.querySelectorAll('.tab-page');

const settings1Loading = document.getElementById('settings1-loading');
const settings1Error = document.getElementById('settings1-error');
const settings1SavedMsg = document.getElementById('settings1-saved-msg');
const settings1Form = document.getElementById('settings1-form');
const s1SlotStepMinutes = document.getElementById('s1-slot-step-minutes');
const s1MaxCapacity = document.getElementById('s1-max-capacity');
const s1CalendarSyncEnabled = document.getElementById('s1-calendar-sync-enabled');
const s1BufferMinutes = document.getElementById('s1-buffer-minutes');
const saveSettings1Btn = document.getElementById('save-settings1-btn');

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
let settings1Loaded = false; // タブを開くたびに再取得しないよう、読み込み済みかどうかを覚えておく
let baseSlotMinutesForConversion = 5; // ページ1取得時にサーバー側の値で更新する（分↔スロット変換用）
let settings2Loaded = false;
let settings4Loaded = false;
let settings5Loaded = false;
let settings6Loaded = false;

const staffNameRows = document.getElementById('staff-name-rows');
const addStaffRowBtn = document.getElementById('add-staff-row-btn');
const settings4Loading = document.getElementById('settings4-loading');
const settings4Error = document.getElementById('settings4-error');
const settings4SavedMsg = document.getElementById('settings4-saved-msg');
const settings4Form = document.getElementById('settings4-form');
const s4ShowStaffSelector = document.getElementById('s4-show-staff-selector');
const s4AllowNoAssign = document.getElementById('s4-allow-no-assign');
const s4NoAssignLabel = document.getElementById('s4-no-assign-label');
const s4NoAssignCalendarId = document.getElementById('s4-no-assign-calendar-id');
const saveSettings4Btn = document.getElementById('save-settings4-btn');

const settings2Loading = document.getElementById('settings2-loading');
const settings2Error = document.getElementById('settings2-error');
const settings2SavedMsg = document.getElementById('settings2-saved-msg');
const settings2Form = document.getElementById('settings2-form');
const s2ReminderDays = document.getElementById('s2-reminder-days');
const s2ReservationSiteUrl = document.getElementById('s2-reservation-site-url');
const adminEmailRows = document.getElementById('admin-email-rows');
const addAdminEmailRowBtn = document.getElementById('add-admin-email-row-btn');
const s2CalendarSalonName = document.getElementById('s2-calendar-salon-name');
const s2MailHeader = document.getElementById('s2-mail-header');
const s2MailFooter = document.getElementById('s2-mail-footer');
const s2ThankYouEnabled = document.getElementById('s2-thankyou-enabled');
const s2ThankYouDays = document.getElementById('s2-thankyou-days');
const s2ThankYouHeader = document.getElementById('s2-thankyou-header');
const s2ThankYouFooter = document.getElementById('s2-thankyou-footer');
const s2ThankYouReviewUrl = document.getElementById('s2-thankyou-review-url');
const s1CancelBuffer = document.getElementById('s1-cancel-buffer');
const s1ChangeBuffer = document.getElementById('s1-change-buffer');
const s1MaxFutureDays = document.getElementById('s1-max-future-days');
const s1DisplayDays = document.getElementById('s1-display-days');
const saveSettings2Btn = document.getElementById('save-settings2-btn');
let settings3Loaded = false;
let accountsLoaded = false;
let waitlistLoaded = false;
let retentionLoaded = false;
const retentionLoading = document.getElementById('retention-loading');
const retentionError = document.getElementById('retention-error');
const retentionSavedMsg = document.getElementById('retention-saved-msg');
const retentionForm = document.getElementById('retention-form');
const saveRetentionBtn = document.getElementById('save-retention-btn');
const retHistoryRetention = document.getElementById('ret-history-retention');
const retCancelHistoryRetention = document.getElementById('ret-cancel-history-retention');
const retCalendarHistoryRetention = document.getElementById('ret-calendar-history-retention');
const retSettingsHistoryRetention = document.getElementById('ret-settings-history-retention');
const retWaitlistRetention = document.getElementById('ret-waitlist-retention');
const waitlistLoading = document.getElementById('waitlist-loading');
const waitlistError = document.getElementById('waitlist-error');
const waitlistTbody = document.getElementById('waitlist-tbody');
const waitlistNoData = document.getElementById('waitlist-no-data');

const accountsLoading = document.getElementById('accounts-loading');
const accountsError = document.getElementById('accounts-error');
const accountsTbody = document.getElementById('accounts-tbody');
const addAccountForm = document.getElementById('add-account-form');
const addAccountError = document.getElementById('add-account-error');
const addAccountSavedMsg = document.getElementById('add-account-saved-msg');
const newLoginIdInput = document.getElementById('new-login-id');
const newPasswordInput = document.getElementById('new-password');
const newDisplayNameInput = document.getElementById('new-display-name');
const addAccountBtn = document.getElementById('add-account-btn');

const menuMasterRows = document.getElementById('menu-master-rows');
const addMenuRowBtn = document.getElementById('add-menu-row-btn');
const settings5Loading = document.getElementById('settings5-loading');
const settings5Error = document.getElementById('settings5-error');
const settings5SavedMsg = document.getElementById('settings5-saved-msg');
const settings5Form = document.getElementById('settings5-form');
const s5ShowMenuMinutes = document.getElementById('s5-show-menu-minutes');
const s5ShowMenuPrice = document.getElementById('s5-show-menu-price');
const s5ShowMenuTotal = document.getElementById('s5-show-menu-total');
const s5MenuNoteText = document.getElementById('s5-menu-note-text');
const btnMenuNoteI18nToggle = document.getElementById('btn-menu-note-i18n-toggle');
const menuNoteI18nPanel = document.getElementById('menu-note-i18n-panel');
const menuNoteI18nRows = document.getElementById('menu-note-i18n-rows');
const s5ProvisionalEnabled = document.getElementById('s5-provisional-enabled');
const s5ProvisionalTargetMenus = document.getElementById('s5-provisional-target-menus');
const s5ProvisionalDeadline = document.getElementById('s5-provisional-deadline');
const s5WaitlistEnabled = document.getElementById('s5-waitlist-enabled');
const s5WaitlistInterval = document.getElementById('s5-waitlist-interval');
const s5WaitlistDeadline = document.getElementById('s5-waitlist-deadline');
const saveSettings5Btn = document.getElementById('save-settings5-btn');

const businessHoursRows = document.getElementById('business-hours-rows');
const slotStepOverrideRows = document.getElementById('slot-step-override-rows');
const settings6Loading = document.getElementById('settings6-loading');
const settings6Error = document.getElementById('settings6-error');
const settings6SavedMsg = document.getElementById('settings6-saved-msg');
const settings6Form = document.getElementById('settings6-form');
const saveSettings6Btn = document.getElementById('save-settings6-btn');
const s6HolidayCalendarId = document.getElementById('s6-holiday-calendar-id');

const settings3Loading = document.getElementById('settings3-loading');
const settings3Error = document.getElementById('settings3-error');const settings3SavedMsg = document.getElementById('settings3-saved-msg');
const settings3Form = document.getElementById('settings3-form');
const s3ShopName = document.getElementById('s3-shop-name');
const s3LogoUrl = document.getElementById('s3-logo-url');
const s3ShopNameFontSize = document.getElementById('s3-shop-name-font-size');
const s3ShopNameColor = document.getElementById('s3-shop-name-color');
const s3ShopNameFontFamily = document.getElementById('s3-shop-name-font-family');
const s3ContactPhone = document.getElementById('s3-contact-phone');
const s3ContactHours = document.getElementById('s3-contact-hours');
const s3ContactClosed = document.getElementById('s3-contact-closed');
const s3HomeUrl = document.getElementById('s3-home-url');
const s3HomeLabel = document.getElementById('s3-home-label');
const s3InfoEnabled = document.getElementById('s3-info-enabled');
const s3InfoHeading = document.getElementById('s3-info-heading');
const s3InfoHeadingFontSize = document.getElementById('s3-info-heading-font-size');
const s3InfoHeadingColor = document.getElementById('s3-info-heading-color');
const s3InfoHeadingFontFamily = document.getElementById('s3-info-heading-font-family');
const infoItemRows = document.getElementById('info-item-rows');
const saveSettings3Btn = document.getElementById('save-settings3-btn');

const INFO_ICON_OPTIONS = [
  { value: 'store', label: 'お店情報アイコン' },
  { value: 'menu', label: 'メニューアイコン' },
  { value: 'map', label: 'マップアイコン' },
  { value: 'staff', label: 'スタッフアイコン' },
  { value: 'price', label: '料金アイコン' },
  { value: 'scissors', label: '技術アイコン' },
  { value: 'coupon', label: 'クーポンアイコン' },
  { value: 'phone', label: '電話アイコン' },
  { value: 'calendar', label: 'カレンダーアイコン' },
  { value: 'star', label: '星（口コミ）アイコン' }
];

// レポートの種類ごとに、表示するカードの要素IDを対応させておく
const REPORT_CARD_MAP = {
  designation: designationReportCard,
  menuCount: menuCountReportCard,
  menuRate: menuRateReportCard,
  timeSlot: timeSlotReportCard,
  newRepeat: newRepeatReportCard,
  frequency: frequencyReportCard,
  dormant: dormantReportCard,
  cancellation: cancellationReportCard
};


/**
 * 管理画面のAPI（doPost）に、セッショントークン付きでリクエストを送る共通関数
 * 今後、管理画面の機能を追加する際は、この関数の形を参考にしてほしい
 * @param {string} action - サーバー側で処理する内容
 * @param {Object} [extraParams] - action以外に送りたい追加パラメータ
 * @returns {Promise<Object>}
 */
async function callAdminApi(action, extraParams = {}) {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
  const body = Object.assign({ action: action, token: token }, extraParams);

  const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  return await response.json();
}

/**
 * ログイン画面・管理画面本体の表示を切り替える
 * @param {boolean} isLoggedIn
 */
function showDashboard(isLoggedIn) {
  if (loginContainer) loginContainer.style.display = isLoggedIn ? 'none' : 'flex';
  if (dashboardContainer) dashboardContainer.style.display = isLoggedIn ? 'block' : 'none';

  if (isLoggedIn) {
    setupReportTypeOptions();
  }
}

/**
 * スタッフ人数を確認し、2人未満の場合は「指名率」の選択肢自体を消す
 * （お客様向けの getSystemSettings は認証不要の公開APIなので、そのまま利用する）
 */
async function setupReportTypeOptions() {
  if (!reportTypeSelect) return;

  try {
    const response = await fetch(`${CONFIG.GAS_WEB_APP_URL}?method=getSystemSettings`);
    const settings = await response.json();
    const staffCount = (settings && Array.isArray(settings.staffList)) ? settings.staffList.length : 0;

    const designationOption = reportTypeSelect.querySelector('option[value="designation"]');
    if (designationOption) {
      designationOption.style.display = staffCount >= 2 ? '' : 'none';
      // 指名率が選べない場合、プルダウンの選択が「指名率」のままにならないようにする
      if (staffCount < 2 && reportTypeSelect.value === 'designation') {
        reportTypeSelect.value = 'menuCount';
      }
    }
  } catch (error) {
    console.error('スタッフ人数の取得に失敗しました（指名率の表示判定をスキップします）:', error);
  }

  updateVisibleReportCard();
}

/**
 * プルダウンで選ばれている種類のカードだけを表示し、操作欄（期間指定 or 月数指定）も切り替える
 */
function updateVisibleReportCard() {
  if (!reportTypeSelect) return;
  const selected = reportTypeSelect.value;

  Object.keys(REPORT_CARD_MAP).forEach(key => {
    const card = REPORT_CARD_MAP[key];
    if (card) card.style.display = (key === selected) ? 'block' : 'none';
  });

  const isDormant = (selected === 'dormant');
  if (dateRangeControls) dateRangeControls.style.display = isDormant ? 'none' : 'flex';
  if (dormantControls) dormantControls.style.display = isDormant ? 'flex' : 'none';
}

if (reportTypeSelect) {
  reportTypeSelect.addEventListener('change', updateVisibleReportCard);
}

/**
 * タブの切り替え。「基本設定」タブは、初めて開いた時だけサーバーから読み込む
 */
if (tabButtons) {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      tabPages.forEach(page => {
        page.style.display = (page.id === `tab-${targetTab}`) ? 'block' : 'none';
      });

      if (targetTab === 'settings1' && !settings1Loaded) {
        loadSettings1();
      }
      if (targetTab === 'settings5' && !settings5Loaded) {
        loadSettings5();
      }
      if (targetTab === 'settings6' && !settings6Loaded) {
        loadSettings6();
      }
      if (targetTab === 'settings4' && !settings4Loaded) {
        loadSettings4();
      }
      if (targetTab === 'settings2' && !settings2Loaded) {
        loadSettings2();
      }
      if (targetTab === 'settings3' && !settings3Loaded) {
        loadSettings3();
      }
      if (targetTab === 'accounts' && !accountsLoaded) {
        loadAccounts();
      }
      if (targetTab === 'waitlist') {
        loadWaitlist();
      }
      if (targetTab === 'retention' && !retentionLoaded) {
        loadRetentionSettings();
      }
    });
  });
}

/**
 * 「キャンセル待ち」タブの一覧を読み込んで表示する
 */
async function loadWaitlist() {
  if (waitlistLoading) waitlistLoading.style.display = 'block';
  if (waitlistError) waitlistError.style.display = 'none';
  if (waitlistNoData) waitlistNoData.style.display = 'none';

  try {
    const result = await callAdminApi('getWaitlistList');
    if (!result.success) throw new Error(result.message || 'キャンセル待ち一覧の取得に失敗しました。');

    const list = result.waitlist || [];

    if (list.length === 0) {
      if (waitlistTbody) waitlistTbody.innerHTML = '';
      if (waitlistNoData) waitlistNoData.style.display = 'block';
    } else if (waitlistTbody) {
      waitlistTbody.innerHTML = list.map(item => `
        <tr>
          <td>${escapeHtmlAdmin(item.registeredAt)}</td>
          <td>${escapeHtmlAdmin(item.date)} ${escapeHtmlAdmin(item.time)}</td>
          <td>${escapeHtmlAdmin(item.staff)}</td>
          <td>${escapeHtmlAdmin(item.menu)}</td>
          <td>${escapeHtmlAdmin(item.name)}</td>
          <td>${escapeHtmlAdmin(item.tel)}</td>
          <td>${escapeHtmlAdmin(item.email)}</td>
          <td>${escapeHtmlAdmin(item.status)}</td>
        </tr>
      `).join('');
    }

    waitlistLoaded = true;
  } catch (error) {
    console.error('キャンセル待ち一覧の取得エラー:', error);
    if (waitlistError) {
      waitlistError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      waitlistError.style.display = 'block';
    }
  } finally {
    if (waitlistLoading) waitlistLoading.style.display = 'none';
  }
}

// 「キャンセル待ち」タブを開いている間だけ、30秒ごとに自動で最新の状態に更新する
setInterval(() => {
  const waitlistTabPage = document.getElementById('tab-waitlist');
  if (waitlistTabPage && waitlistTabPage.style.display === 'block') {
    loadWaitlist();
  }
}, 30000);

/**
 * 「保存期間」タブの読み込み（settings1と同じgetSettingsPage1のデータを再利用する）
 */
async function loadRetentionSettings() {
  if (retentionLoading) retentionLoading.style.display = 'block';
  if (retentionError) retentionError.style.display = 'none';
  if (retentionForm) retentionForm.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage1');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    if (retHistoryRetention) retHistoryRetention.value = result.historyRetentionMonths;
    if (retCancelHistoryRetention) retCancelHistoryRetention.value = result.cancelHistoryRetentionMonths;
    if (retCalendarHistoryRetention) retCalendarHistoryRetention.value = result.calendarHistoryRetentionMonths;
    if (retSettingsHistoryRetention) retSettingsHistoryRetention.value = result.settingsHistoryRetentionMonths;
    if (retWaitlistRetention) retWaitlistRetention.value = result.waitlistRetentionMonths;

    retentionLoaded = true;
    if (retentionForm) retentionForm.style.display = 'block';
  } catch (error) {
    console.error('保存期間の取得エラー:', error);
    if (retentionError) {
      retentionError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      retentionError.style.display = 'block';
    }
  } finally {
    if (retentionLoading) retentionLoading.style.display = 'none';
  }
}

if (retentionForm) {
  retentionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (retentionError) retentionError.style.display = 'none';
    if (retentionSavedMsg) retentionSavedMsg.style.display = 'none';
    if (saveRetentionBtn) {
      saveRetentionBtn.disabled = true;
      saveRetentionBtn.textContent = '保存中...';
    }

    try {
      const settings = {
        HISTORY_RETENTION_MONTHS: parseInt(retHistoryRetention.value, 10) || 12,
        CANCEL_HISTORY_RETENTION_MONTHS: parseInt(retCancelHistoryRetention.value, 10) || 12,
        CALENDAR_HISTORY_RETENTION_MONTHS: parseInt(retCalendarHistoryRetention.value, 10) || 12,
        SETTINGS_HISTORY_RETENTION_MONTHS: parseInt(retSettingsHistoryRetention.value, 10) || 12,
        WAITLIST_RETENTION_MONTHS: parseInt(retWaitlistRetention.value, 10) || 12
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (retentionSavedMsg) retentionSavedMsg.style.display = 'block';
    } catch (error) {
      console.error('保存期間の保存エラー:', error);
      if (retentionError) {
        retentionError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        retentionError.style.display = 'block';
      }
    } finally {
      if (saveRetentionBtn) {
        saveRetentionBtn.disabled = false;
        saveRetentionBtn.textContent = '保存する';
      }
    }
  });
}

/**
 * Dateオブジェクトを "yyyy-MM-dd" 形式の文字列に変換する
 * @param {Date} d
 * @returns {string}
 */
function formatDateForInput(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * クイックボタン（今週・今月・先月）に応じた開始日・終了日を計算する
 * @param {string} rangeKey
 * @returns {{start: Date, end: Date}}
 */
function calcQuickRange(rangeKey) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (rangeKey === 'thisWeek') {
    const dayOfWeek = today.getDay(); // 0:日曜
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  if (rangeKey === 'thisMonth') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start, end };
  }

  if (rangeKey === 'lastMonth') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    return { start, end };
  }

  return { start: today, end: today };
}

if (quickRangeButtons) {
  quickRangeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const { start, end } = calcQuickRange(btn.getAttribute('data-range'));
      if (reportStartDateInput) reportStartDateInput.value = formatDateForInput(start);
      if (reportEndDateInput) reportEndDateInput.value = formatDateForInput(end);
    });
  });
}

/**
 * プルダウンで選ばれているレポートだけを取得・表示する
 * （メニュー実績とメニュー率は、同じデータから両方描画できるので、片方選んだ時点でもう片方も一緒に計算しておく）
 */
async function runReport() {
  const selected = reportTypeSelect ? reportTypeSelect.value : 'designation';
  const isDormant = (selected === 'dormant');

  const startDate = reportStartDateInput ? reportStartDateInput.value : '';
  const endDate = reportEndDateInput ? reportEndDateInput.value : '';
  const monthsThreshold = dormantMonthsInput ? dormantMonthsInput.value : '3';

  if (reportError) reportError.style.display = 'none';
  if (reportResults) reportResults.style.display = 'none';

  if (!isDormant && (!startDate || !endDate)) {
    if (reportError) {
      reportError.textContent = '開始日・終了日を入力してください。';
      reportError.style.display = 'block';
    }
    return;
  }

  if (runReportBtn) {
    runReportBtn.disabled = true;
    runReportBtn.textContent = '集計中...';
  }

  try {
    let result;

    if (selected === 'designation') {
      result = await callAdminApi('getDesignationRateReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderDesignationReport(result);

    } else if (selected === 'menuCount' || selected === 'menuRate') {
      result = await callAdminApi('getMenuPerformanceReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderMenuPerformanceReport(result);
      renderMenuRateReport(result);

    } else if (selected === 'timeSlot') {
      result = await callAdminApi('getTimeSlotPatternReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderTimeSlotReport(result);

    } else if (selected === 'newRepeat') {
      result = await callAdminApi('getNewRepeatRatioReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderNewRepeatReport(result);

    } else if (selected === 'frequency') {
      result = await callAdminApi('getVisitFrequencyDistributionReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderFrequencyReport(result);

    } else if (selected === 'dormant') {
      result = await callAdminApi('getDormantCustomersReport', { monthsThreshold });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderDormantReport(result);

    } else if (selected === 'cancellation') {
      result = await callAdminApi('getCancellationRateReport', { startDate, endDate });
      if (!result.success) throw new Error(result.message || '集計に失敗しました。');
      renderCancellationReport(result);
    }

    if (reportResults) reportResults.style.display = 'block';
    updateVisibleReportCard();
  } catch (error) {
    console.error('レポート取得エラー:', error);
    if (reportError) {
      reportError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      reportError.style.display = 'block';
    }
  } finally {
    if (runReportBtn) {
      runReportBtn.disabled = false;
      runReportBtn.textContent = '集計する';
    }
  }
}

/**
 * 指名率レポートの結果を画面に描画する
 * @param {Object} data - getDesignationRateReport の戻り値
 */
function renderDesignationReport(data) {
  if (designationSummary) {
    designationSummary.innerHTML = `
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.designatedRate}%</div>
        <div class="designation-summary-label">指名（${data.designatedCount}件）</div>
      </div>
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.noAssignRate}%</div>
        <div class="designation-summary-label">指名なし（${data.noAssignCount}件）</div>
      </div>
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.totalCount}</div>
        <div class="designation-summary-label">合計件数</div>
      </div>
    `;
  }

  if (designationByStaff) {
    const staffNames = Object.keys(data.byStaff || {}).sort((a, b) => data.byStaff[b] - data.byStaff[a]);
    if (staffNames.length === 0) {
      designationByStaff.innerHTML = '<p>この期間の指名データはありません。</p>';
    } else {
      designationByStaff.innerHTML = staffNames.map(name =>
        `<div class="designation-by-staff-row"><span>${escapeHtmlAdmin(name)}</span><span>${data.byStaff[name]}件</span></div>`
      ).join('');
    }
  }
}

/**
 * メニュー実績レポートの結果を画面に描画する
 * @param {Object} data - getMenuPerformanceReport の戻り値
 */
function renderMenuPerformanceReport(data) {
  if (!menuPerformanceTbody) return;

  const ranking = data.ranking || [];
  if (ranking.length === 0) {
    menuPerformanceTbody.innerHTML = '<tr><td colspan="2">この期間のメニューデータはありません。</td></tr>';
    return;
  }

  menuPerformanceTbody.innerHTML = ranking.map(item =>
    `<tr><td>${escapeHtmlAdmin(item.menuName)}</td><td>${item.count}件</td></tr>`
  ).join('');
}

/**
 * メニュー率レポート（メニュー実績と同じデータから、割合を計算して表示する）
 * @param {Object} data - getMenuPerformanceReport の戻り値
 */
function renderMenuRateReport(data) {
  if (!menuRateTbody) return;

  const ranking = data.ranking || [];
  if (ranking.length === 0) {
    menuRateTbody.innerHTML = '<tr><td colspan="2">この期間のメニューデータはありません。</td></tr>';
    return;
  }

  const total = ranking.reduce((sum, item) => sum + item.count, 0);

  menuRateTbody.innerHTML = ranking.map(item => {
    const rate = total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0;
    return `<tr><td>${escapeHtmlAdmin(item.menuName)}</td><td>${rate}%</td></tr>`;
  }).join('');
}

/**
 * 曜日・時間帯の傾向レポートを表として描画する
 * @param {Object} data - getTimeSlotPatternReport の戻り値
 */
function renderTimeSlotReport(data) {
  if (!timeSlotTableWrap) return;

  const grid = data.grid || {};
  const dayLabels = data.dayLabels || ["日", "月", "火", "水", "木", "金", "土"];

  // 実際にデータがある時間帯だけを列に出す（0〜23時全部は出さない）
  const hoursSet = new Set();
  Object.keys(grid).forEach(day => {
    Object.keys(grid[day]).forEach(hour => hoursSet.add(parseInt(hour, 10)));
  });
  const hours = Array.from(hoursSet).sort((a, b) => a - b);

  if (hours.length === 0) {
    timeSlotTableWrap.innerHTML = '<p>この期間の予約データはありません。</p>';
    return;
  }

  let html = '<table class="time-slot-table"><thead><tr><th>曜日＼時</th>';
  hours.forEach(h => { html += `<th>${h}時</th>`; });
  html += '</tr></thead><tbody>';

  for (let d = 0; d < 7; d++) {
    html += `<tr><th>${dayLabels[d]}</th>`;
    hours.forEach(h => {
      const count = (grid[d] && grid[d][h]) || 0;
      html += count > 0 ? `<td class="has-count">${count}</td>` : `<td>-</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody></table>';

  timeSlotTableWrap.innerHTML = html;
}

/**
 * 新規・リピート比率レポートを描画する
 * @param {Object} data - getNewRepeatRatioReport の戻り値
 */
function renderNewRepeatReport(data) {
  if (!newRepeatSummary) return;

  newRepeatSummary.innerHTML = `
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.newRate}%</div>
      <div class="designation-summary-label">新規（${data.newCount}人）</div>
    </div>
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.repeatRate}%</div>
      <div class="designation-summary-label">リピート（${data.repeatCount}人）</div>
    </div>
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.totalCount}</div>
      <div class="designation-summary-label">合計人数</div>
    </div>
  `;
}

/**
 * 来店頻度の分布レポートを描画する
 * @param {Object} data - getVisitFrequencyDistributionReport の戻り値
 */
function renderFrequencyReport(data) {
  if (!frequencySummary) return;

  frequencySummary.innerHTML = `
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.once}</div>
      <div class="designation-summary-label">1回</div>
    </div>
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.fewTimes}</div>
      <div class="designation-summary-label">2〜3回</div>
    </div>
    <div class="designation-summary-item">
      <div class="designation-summary-value">${data.loyal}</div>
      <div class="designation-summary-label">4回以上</div>
    </div>
  `;
}

/**
 * 休眠顧客リストを描画する
 * @param {Object} data - getDormantCustomersReport の戻り値
 */
function renderDormantReport(data) {
  if (dormantCountLabel) {
    dormantCountLabel.textContent = `最終来店から${data.monthsThreshold}ヶ月以上：${data.count}名`;
  }

  if (!dormantTbody) return;

  const list = data.list || [];
  if (list.length === 0) {
    dormantTbody.innerHTML = '<tr><td colspan="4">該当するお客様はいません。</td></tr>';
    return;
  }

  dormantTbody.innerHTML = list.map(c =>
    `<tr><td>${escapeHtmlAdmin(c.name)}</td><td>${escapeHtmlAdmin(c.tel)}</td><td>${c.lastVisitDate}</td><td>${c.visitCount}回</td></tr>`
  ).join('');
}

/**
 * キャンセル率レポートを描画する
 * @param {Object} data - getCancellationRateReport の戻り値
 */
function renderCancellationReport(data) {
  if (cancellationSummary) {
    cancellationSummary.innerHTML = `
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.cancelRate}%</div>
        <div class="designation-summary-label">キャンセル率</div>
      </div>
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.cancelCount}</div>
        <div class="designation-summary-label">キャンセル件数</div>
      </div>
      <div class="designation-summary-item">
        <div class="designation-summary-value">${data.totalCount}</div>
        <div class="designation-summary-label">予約件数（合計）</div>
      </div>
    `;
  }

  if (cancellationBreakdown) {
    cancellationBreakdown.innerHTML = `
      <div class="designation-by-staff-row"><span>お客様によるキャンセル</span><span>${data.customerCancelCount}件</span></div>
      <div class="designation-by-staff-row"><span>仮予約タイムアウト（自動）</span><span>${data.timeoutCount}件</span></div>
    `;
  }
}

/**
 * 簡易的なHTMLエスケープ（メニュー名・スタッフ名をそのまま画面に表示するため）
 * @param {string} str
 * @returns {string}
 */
function escapeHtmlAdmin(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 「基本設定」タブの現在値を取得し、フォームに反映する
 */
async function loadSettings1() {
  if (settings1Loading) settings1Loading.style.display = 'block';
  if (settings1Error) settings1Error.style.display = 'none';
  if (settings1Form) settings1Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage1');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    // 予約枠の刻み幅（内部はスロット数だが、画面上は分で表示する）
    baseSlotMinutesForConversion = result.baseSlotMinutes || 5;
    if (s1SlotStepMinutes) s1SlotStepMinutes.value = result.displaySlotStepMinutes || 30;

    // キャンセル・変更の受付締切
    if (s1CancelBuffer) s1CancelBuffer.value = result.cancelBufferHours;
    if (s1ChangeBuffer) s1ChangeBuffer.value = result.changeBufferHours;

    // 予約可能な期間
    if (s1MaxFutureDays) s1MaxFutureDays.value = result.maxFutureDaysToReserve;
    if (s1DisplayDays) s1DisplayDays.value = String(result.displayDays);

    // 受付の基本設定
    if (s1MaxCapacity) s1MaxCapacity.value = result.maxCapacity;
    if (s1CalendarSyncEnabled) s1CalendarSyncEnabled.checked = !!result.calendarSyncEnabled;
    if (s1BufferMinutes) s1BufferMinutes.value = result.bufferMinutesBeforeReservation;

    settings1Loaded = true;
    if (settings1Form) settings1Form.style.display = 'block';
  } catch (error) {
    console.error('基本設定の取得エラー:', error);
    if (settings1Error) {
      settings1Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings1Error.style.display = 'block';
    }
  } finally {
    if (settings1Loading) settings1Loading.style.display = 'none';
  }
}

/**
 * 営業時間の入力行を、日〜土の7行分描画する
 * @param {Object} business - { 曜日番号: [開始時, 閉店時] }
 */
/**
 * 「時」「分」を別々のプルダウンで選ぶ入力欄一式を組み立てる（ブラウザ標準のtime入力は、スクロールで進みすぎて使いにくいため）
 * @param {string} className - この入力欄一式に共通で付けるクラス名（値の取得時に使う）
 * @param {string} timeStr - 初期値（"HH:mm"形式。空文字なら未選択状態）
 * @param {boolean} disabled - 無効状態で表示するか
 * @returns {string} HTML文字列
 */
function buildTimeSelectHtml(className, timeStr, disabled) {
  const [hourVal, minuteVal] = (timeStr || '').split(':');

  let hourOptions = '<option value="">--</option>';
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    hourOptions += `<option value="${hh}" ${hourVal === hh ? 'selected' : ''}>${hh}</option>`;
  }

  let minuteOptions = '<option value="">--</option>';
  for (let m = 0; m < 60; m += 5) {
    const mm = String(m).padStart(2, '0');
    minuteOptions += `<option value="${mm}" ${minuteVal === mm ? 'selected' : ''}>${mm}</option>`;
  }

  const disabledAttr = disabled ? 'disabled' : '';
  return `<span class="time-select-pair ${className}"><select class="time-hour-select" ${disabledAttr}>${hourOptions}</select>:<select class="time-minute-select" ${disabledAttr}>${minuteOptions}</select></span>`;
}

/**
 * buildTimeSelectHtmlで作った時・分プルダウンから、"HH:mm"形式の値を読み取る（片方でも未選択なら空文字を返す）
 * @param {Element} container - プルダウンが含まれる親要素
 * @param {string} className - buildTimeSelectHtmlに渡したのと同じクラス名
 * @returns {string} "HH:mm" または 空文字
 */
function getTimeFromSelects(container, className) {
  const wrap = container.querySelector(`.${className}`);
  if (!wrap) return '';
  const hour = wrap.querySelector('.time-hour-select').value;
  const minute = wrap.querySelector('.time-minute-select').value;
  if (!hour || !minute) return '';
  return `${hour}:${minute}`;
}

function renderBusinessHoursRows(business, lastOrderOverride) {
  if (!businessHoursRows) return;

  lastOrderOverride = lastOrderOverride || {};

  businessHoursRows.innerHTML = DAY_LABELS.map((label, dayIndex) => {
    const hours = business[dayIndex] || business[String(dayIndex)] || null;
    const openHour = hours ? hours[0] : '';
    const closeHour = hours ? hours[1] : '';

    const override = lastOrderOverride[dayIndex] || lastOrderOverride[String(dayIndex)] || null;
    const hasOverride = !!override;
    const lastOrderTime = override ? override.lastOrderTime : '';
    const overrideCloseTime = override ? override.closeTime : '';

    return `
      <div class="business-hours-row" data-day="${dayIndex}">
        <span class="day-label">${label}曜日</span>
        <input type="number" class="business-open-input" min="0" max="23" value="${openHour}" placeholder="休">
        <span class="time-sep">時 〜</span>
        <input type="number" class="business-close-input" min="0" max="23" value="${closeHour}" placeholder="休">
        <span class="time-sep">時</span>
      </div>
      <div class="last-order-row" data-day="${dayIndex}">
        <label><input type="checkbox" class="last-order-check" ${hasOverride ? 'checked' : ''}> 最終受付制を設定する</label>
        <span class="last-order-time-pair"><span>最終受付</span>${buildTimeSelectHtml('last-order-time-select', lastOrderTime, !hasOverride)}</span>
        <span class="last-order-time-pair"><span>終了時刻</span>${buildTimeSelectHtml('last-order-close-select', overrideCloseTime, !hasOverride)}</span>
      </div>
    `;
  }).join('');

  // チェックのON/OFFで、時刻入力欄の有効・無効を切り替える
  businessHoursRows.querySelectorAll('.last-order-check').forEach(check => {
    check.addEventListener('change', () => {
      const row = check.closest('.last-order-row');
      row.querySelectorAll('select').forEach(select => {
        select.disabled = !check.checked;
      });
    });
  });
}

/**
 * 「指定時間、予約間隔の設定」の入力行を、日〜土の7行分描画する
 * @param {Object} overrideByDay - { 曜日番号: { startTime, endTime, stepMinutes } }
 */
function renderSlotStepOverrideRows(overrideByDay) {
  if (!slotStepOverrideRows) return;

  slotStepOverrideRows.innerHTML = DAY_LABELS.map((label, dayIndex) => {
    const override = overrideByDay[dayIndex] || overrideByDay[String(dayIndex)] || null;
    const hasOverride = !!override;
    const startTime = override ? override.startTime : '';
    const endTime = override ? override.endTime : '';
    const stepMinutes = override ? override.stepMinutes : '';

    return `
      <div class="slot-step-override-row" data-day="${dayIndex}">
        <span class="day-label">${label}曜日</span>
        <label><input type="checkbox" class="slot-override-check" ${hasOverride ? 'checked' : ''}> 使う</label>
        ${buildTimeSelectHtml('slot-override-start-select', startTime, !hasOverride)}
        <span>〜</span>
        ${buildTimeSelectHtml('slot-override-end-select', endTime, !hasOverride)}
        <input type="number" class="slot-override-minutes-input" min="5" step="5" value="${stepMinutes}" placeholder="分" ${hasOverride ? '' : 'disabled'}>
        <span>分間隔</span>
      </div>
    `;
  }).join('');

  slotStepOverrideRows.querySelectorAll('.slot-override-check').forEach(check => {
    check.addEventListener('change', () => {
      const row = check.closest('.slot-step-override-row');
      row.querySelectorAll('select, input:not(.slot-override-check)').forEach(input => {
        input.disabled = !check.checked;
      });
    });
  });
}


function renderMenuMasterRows(menuMaster) {
  if (!menuMasterRows) return;

  const entries = Object.keys(menuMaster).map(name => ({ name, ...menuMaster[name] }));
  menuMasterRows.innerHTML = '';
  entries.forEach(entry => addMenuRow(entry.name, entry.minutes, entry.price, entry.minutesApprox, entry.priceApprox, entry.i18n || {}));

  if (entries.length === 0) addMenuRow('', '', '');
}

/**
 * メニュー行を1行追加する
 */
// 多言語対応サイトの翻訳入力で使う対象言語一覧（日本語は基本言語のため対象外）
const I18N_TARGET_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'fr', label: 'Français' }
];

/**
 * Google翻訳を、日本語原文入りで新しいタブに開くためのURLを作る
 * @param {string} sourceText - 日本語の原文
 * @param {string} targetLangCode - 翻訳先の言語コード
 * @returns {string}
 */
function buildGoogleTranslateUrl(sourceText, targetLangCode) {
  return `https://translate.google.com/?sl=ja&tl=${encodeURIComponent(targetLangCode)}&text=${encodeURIComponent(sourceText)}&op=translate`;
}

/**
 * 5言語分の翻訳入力欄（ラベル・入力欄・Google翻訳リンク）のHTMLをまとめて作る
 * @param {string} inputClass - 各入力欄に付けるclass名
 * @param {Object} i18nValues - { en, ko, "zh-CN", "zh-TW", fr } の現在値
 * @param {boolean} [useTextarea] - true なら複数行のtextarea、falseなら1行のinput
 * @returns {string}
 */
function buildI18nPanelHtml(inputClass, i18nValues, useTextarea) {
  const values = i18nValues || {};
  return I18N_TARGET_LANGS.map(lang => {
    const fieldTag = useTextarea
      ? `<textarea class="${inputClass}" data-lang="${lang.code}" rows="2" placeholder="未入力の場合は日本語のまま表示されます">${escapeHtmlAdmin(values[lang.code] || '')}</textarea>`
      : `<input type="text" class="${inputClass}" data-lang="${lang.code}" value="${escapeHtmlAdmin(values[lang.code] || '')}" placeholder="未入力の場合は日本語のまま表示されます">`;
    return `
      <div class="i18n-panel-row">
        <span class="i18n-panel-lang-label">${lang.label}</span>
        ${fieldTag}
        <a href="#" target="_blank" rel="noopener" class="i18n-translate-link" data-lang="${lang.code}">Google翻訳で開く ↗</a>
      </div>
    `;
  }).join('');
}

/**
 * 翻訳パネル内の「Google翻訳で開く」リンク先を、現在の日本語原文で更新する
 * @param {HTMLElement} panelEl - buildI18nPanelHtmlで作ったパネル要素
 * @param {string} sourceText - 現在の日本語原文
 */
function refreshI18nTranslateLinks(panelEl, sourceText) {
  panelEl.querySelectorAll('.i18n-translate-link').forEach(link => {
    link.href = buildGoogleTranslateUrl(sourceText, link.getAttribute('data-lang'));
  });
}

/**
 * 予約通知メール宛先の入力欄を、カンマ区切りの文字列から複数行描画する
 * @param {string} emailsCsv - カンマ区切りのメールアドレス（例："a@example.com,b@example.com"）
 */
function renderAdminEmailRows(emailsCsv) {
  if (!adminEmailRows) return;

  const emails = String(emailsCsv || '').split(',').map(e => e.trim()).filter(e => e.length > 0);
  adminEmailRows.innerHTML = '';
  emails.forEach(email => addAdminEmailRow(email));

  if (emails.length === 0) addAdminEmailRow('');
}

/**
 * 予約通知メール宛先の入力欄を1行追加する
 * @param {string} email
 */
function addAdminEmailRow(email = '') {
  if (!adminEmailRows) return;

  const row = document.createElement('div');
  row.className = 'admin-email-row';
  row.innerHTML = `
    <input type="text" class="admin-email-input" value="${escapeHtmlAdmin(email)}" placeholder="例：owner@example.com">
    <button type="button" class="btn-remove-row" title="この宛先を削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  adminEmailRows.appendChild(row);
}

/**
 * 入力されている予約通知メール宛先を集めて、カンマ区切りの文字列にする（空欄は除外）
 * @returns {string}
 */
function collectAdminEmails() {
  const emails = [];
  document.querySelectorAll('.admin-email-input').forEach(input => {
    const val = input.value.trim();
    if (val) emails.push(val);
  });
  return emails.join(',');
}

if (addAdminEmailRowBtn) {
  addAdminEmailRowBtn.addEventListener('click', () => addAdminEmailRow());
}

function addMenuRow(name = '', minutes = '', price = '', minutesApprox = false, priceApprox = false, i18n = {}) {
  if (!menuMasterRows) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'menu-master-row-wrapper';

  const row = document.createElement('div');
  row.className = 'menu-master-row';
  row.innerHTML = `
    <input type="text" class="menu-name-input col-name" placeholder="メニュー名（例：カット）" value="${escapeHtmlAdmin(name)}">
    <div class="col-minutes menu-field-group">
      <input type="number" class="menu-minutes-input" placeholder="分" min="5" step="5" value="${minutes}">
      <span class="menu-field-unit">分</span>
      <label class="menu-approx-label"><input type="checkbox" class="menu-minutes-approx-input" ${minutesApprox ? 'checked' : ''}> ～</label>
    </div>
    <div class="col-price menu-field-group">
      <span class="menu-field-unit">￥</span>
      <input type="number" class="menu-price-input" placeholder="円" min="0" value="${price}">
      <label class="menu-approx-label"><input type="checkbox" class="menu-price-approx-input" ${priceApprox ? 'checked' : ''}> ～</label>
    </div>
    <div class="col-actions">
      <button type="button" class="btn-menu-i18n-toggle" title="表示名の翻訳を編集（多言語対応サイト向け）">🌐</button>
      <button type="button" class="btn-remove-row" title="このメニューを削除">×</button>
    </div>
  `;

  const i18nPanel = document.createElement('div');
  i18nPanel.className = 'menu-i18n-panel';
  i18nPanel.style.display = 'none';
  i18nPanel.innerHTML = `<p class="i18n-panel-note">メニュー名の多言語対応サイト向け表示名（未入力の言語は日本語のまま表示されます）</p>` + buildI18nPanelHtml('menu-i18n-input', i18n, false);

  row.querySelector('.btn-remove-row').addEventListener('click', () => wrapper.remove());
  row.querySelector('.btn-menu-i18n-toggle').addEventListener('click', () => {
    const nameVal = row.querySelector('.menu-name-input').value.trim();
    refreshI18nTranslateLinks(i18nPanel, nameVal);
    i18nPanel.style.display = (i18nPanel.style.display === 'none') ? 'block' : 'none';
  });

  wrapper.appendChild(row);
  wrapper.appendChild(i18nPanel);
  menuMasterRows.appendChild(wrapper);
}

if (addMenuRowBtn) {
  addMenuRowBtn.addEventListener('click', () => addMenuRow());
}

if (btnMenuNoteI18nToggle && menuNoteI18nPanel) {
  btnMenuNoteI18nToggle.addEventListener('click', () => {
    const sourceText = s5MenuNoteText ? s5MenuNoteText.value.trim() : '';
    refreshI18nTranslateLinks(menuNoteI18nPanel, sourceText);
    menuNoteI18nPanel.style.display = (menuNoteI18nPanel.style.display === 'none') ? 'block' : 'none';
  });
}

/**
 * スタッフ名の入力行を描画する（カレンダーIDは隠しdata属性として各行に保持する）
 * @param {Object} staffMaster - { スタッフ名: カレンダーID }
 */
/**
 * スタッフ名・カレンダーIDの入力行を描画する
 * @param {Object} staffMaster - { スタッフ名: カレンダーID }
 */
function renderStaffNameRows(staffMaster) {
  if (!staffNameRows) return;

  const names = Object.keys(staffMaster);
  staffNameRows.innerHTML = '';
  names.forEach(name => addStaffRow(name, staffMaster[name]));

  if (names.length === 0) addStaffRow('', '');
}

/**
 * スタッフ行を1行追加する（名前・カレンダーID・削除ボタン）
 */
function addStaffRow(name = '', calendarId = '') {
  if (!staffNameRows) return;

  const row = document.createElement('div');
  row.className = 'staff-name-row';
  row.innerHTML = `
    <input type="text" class="staff-name-input" placeholder="スタッフ名（例：下鶴）" value="${escapeHtmlAdmin(name)}">
    <input type="text" class="staff-calendar-id-input" placeholder="カレンダーID（xxxx@group.calendar.google.com）" value="${escapeHtmlAdmin(calendarId)}">
    <button type="button" class="btn-remove-row" title="このスタッフを削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  staffNameRows.appendChild(row);
}

if (addStaffRowBtn) {
  addStaffRowBtn.addEventListener('click', () => addStaffRow());
}

/**
 * フォームの入力内容を集めて、Config.gsのキー名に合わせた形に組み立てる
 * @returns {Object} saveSettings に渡す { 設定キー: 値 } のマップ
 */
function collectSettings1FormData() {
  const settings = {};

  // 予約枠の刻み幅（画面上の「分」を、内部のスロット数に変換して保存する）
  const stepMinutes = s1SlotStepMinutes ? parseInt(s1SlotStepMinutes.value, 10) : 30;
  if (!isNaN(stepMinutes) && stepMinutes > 0) {
    settings.DISPLAY_SLOT_STEP = Math.round(stepMinutes / baseSlotMinutesForConversion);
  }

  // キャンセル・変更の受付締切
  settings.CANCEL_BUFFER_HOURS_BEFORE_RESERVATION = parseInt(s1CancelBuffer.value, 10);
  settings.CHANGE_BUFFER_HOURS_BEFORE_RESERVATION = parseInt(s1ChangeBuffer.value, 10);

  // 予約可能な期間
  settings.MAX_FUTURE_DAYS_TO_RESERVE = parseInt(s1MaxFutureDays.value, 10);
  settings.DISPLAY_DAYS = parseInt(s1DisplayDays.value, 10);

  // 受付の基本設定
  settings.MAX_CAPACITY = parseInt(s1MaxCapacity.value, 10);
  settings.CALENDAR_SYNC_ENABLED = !!s1CalendarSyncEnabled.checked;
  settings.BUFFER_MINUTES_BEFORE_RESERVATION = parseInt(s1BufferMinutes.value, 10);

  return settings;
}

if (settings1Form) {
  settings1Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings1Error) settings1Error.style.display = 'none';
    if (settings1SavedMsg) settings1SavedMsg.style.display = 'none';
    if (saveSettings1Btn) {
      saveSettings1Btn.disabled = true;
      saveSettings1Btn.textContent = '保存中...';
    }

    try {
      const settings = collectSettings1FormData();
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';

      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings1SavedMsg) settings1SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('基本設定の保存エラー:', error);
      if (settings1Error) {
        settings1Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings1Error.style.display = 'block';
      }
    } finally {
      if (saveSettings1Btn) {
        saveSettings1Btn.disabled = false;
        saveSettings1Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 「メニュー関係」タブの現在値を取得し、フォームに反映する
 */
async function loadSettings5() {
  if (settings5Loading) settings5Loading.style.display = 'block';
  if (settings5Error) settings5Error.style.display = 'none';
  if (settings5Form) settings5Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage5');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    renderMenuMasterRows(result.menuMaster || {});

    setRadioValue('s5-menu-selector-type', result.menuSelectorType || 'TYPE_B');
    if (s5ShowMenuMinutes) s5ShowMenuMinutes.checked = !!result.showMenuMinutes;
    if (s5ShowMenuPrice) s5ShowMenuPrice.checked = !!result.showMenuPrice;
    if (s5ShowMenuTotal) s5ShowMenuTotal.checked = !!result.showMenuTotal;
    if (s5MenuNoteText) s5MenuNoteText.value = result.menuNoteText || '';
    if (menuNoteI18nRows) {
      menuNoteI18nRows.innerHTML = buildI18nPanelHtml('menu-note-i18n-input', result.menuNoteTextI18n || {}, true);
    }
    if (menuNoteI18nPanel) menuNoteI18nPanel.style.display = 'none';

    // 仮予約制度
    const provisional = result.provisionalReservation || {};
    if (s5ProvisionalEnabled) s5ProvisionalEnabled.checked = !!provisional.enabled;
    setRadioValue('s5-provisional-target', provisional.target || 'ALL');
    if (s5ProvisionalTargetMenus) s5ProvisionalTargetMenus.value = (provisional.targetMenus || []).join(',');
    if (s5ProvisionalDeadline) s5ProvisionalDeadline.value = provisional.confirmDeadlineHours || 12;
    setRadioValue('s5-provisional-auto-action', provisional.autoAction || 'NONE');

    // キャンセル待ち機能（空欄のままにしたいので、値が無い時は空文字にする）
    const waitlist = result.waitlist || {};
    if (s5WaitlistEnabled) s5WaitlistEnabled.checked = !!waitlist.enabled;
    if (s5WaitlistInterval) s5WaitlistInterval.value = (waitlist.notifyIntervalMinutes === "" || waitlist.notifyIntervalMinutes === null || typeof waitlist.notifyIntervalMinutes === 'undefined') ? '' : waitlist.notifyIntervalMinutes;
    if (s5WaitlistDeadline) s5WaitlistDeadline.value = (waitlist.notifyDeadlineMinutes === "" || waitlist.notifyDeadlineMinutes === null || typeof waitlist.notifyDeadlineMinutes === 'undefined') ? '' : waitlist.notifyDeadlineMinutes;

    settings5Loaded = true;
    if (settings5Form) settings5Form.style.display = 'block';
  } catch (error) {
    console.error('メニュー関係の取得エラー:', error);
    if (settings5Error) {
      settings5Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings5Error.style.display = 'block';
    }
  } finally {
    if (settings5Loading) settings5Loading.style.display = 'none';
  }
}

if (settings5Form) {
  settings5Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings5Error) settings5Error.style.display = 'none';
    if (settings5SavedMsg) settings5SavedMsg.style.display = 'none';
    if (saveSettings5Btn) {
      saveSettings5Btn.disabled = true;
      saveSettings5Btn.textContent = '保存中...';
    }

    try {
      const menuMaster = {};
      document.querySelectorAll('.menu-master-row').forEach(row => {
        const name = row.querySelector('.menu-name-input').value.trim();
        const minutes = parseInt(row.querySelector('.menu-minutes-input').value, 10);
        const price = parseInt(row.querySelector('.menu-price-input').value, 10);
        const minutesApprox = row.querySelector('.menu-minutes-approx-input').checked;
        const priceApprox = row.querySelector('.menu-price-approx-input').checked;

        // 翻訳パネル（この行の次の兄弟要素）から、入力済みの翻訳を集める（空欄の言語は保存しない）
        const i18nPanel = row.nextElementSibling;
        const i18n = {};
        if (i18nPanel) {
          i18nPanel.querySelectorAll('.menu-i18n-input').forEach(input => {
            const val = input.value.trim();
            if (val) i18n[input.getAttribute('data-lang')] = val;
          });
        }

        if (name && !isNaN(minutes) && minutes > 0) {
          menuMaster[name] = { minutes: minutes, slots: Math.ceil(minutes / 5), price: isNaN(price) ? 0 : price, minutesApprox: minutesApprox, priceApprox: priceApprox, i18n: i18n };
        }
      });

      const targetMenus = s5ProvisionalTargetMenus.value.split(',').map(m => m.trim()).filter(m => m.length > 0);
      const waitlistInterval = s5WaitlistInterval.value.trim();
      const waitlistDeadline = s5WaitlistDeadline.value.trim();

      const settings = {
        MENU_MASTER: menuMaster,
        MENU_SELECTOR_TYPE: getRadioValue('s5-menu-selector-type') || 'TYPE_B',
        SHOW_MENU_MINUTES: !!s5ShowMenuMinutes.checked,
        SHOW_MENU_PRICE: !!s5ShowMenuPrice.checked,
        SHOW_MENU_TOTAL: !!s5ShowMenuTotal.checked,
        MENU_NOTE_TEXT: s5MenuNoteText.value,
        MENU_NOTE_TEXT_I18N: (() => {
          const result = {};
          if (menuNoteI18nRows) {
            menuNoteI18nRows.querySelectorAll('.menu-note-i18n-input').forEach(field => {
              const val = field.value.trim();
              if (val) result[field.getAttribute('data-lang')] = val;
            });
          }
          return result;
        })(),
        PROVISIONAL_RESERVATION: {
          enabled: !!s5ProvisionalEnabled.checked,
          target: getRadioValue('s5-provisional-target') || 'ALL',
          targetMenus: targetMenus,
          confirmDeadlineHours: parseInt(s5ProvisionalDeadline.value, 10) || 12,
          autoAction: getRadioValue('s5-provisional-auto-action') || 'NONE'
        },
        WAITLIST: {
          enabled: !!s5WaitlistEnabled.checked,
          notifyIntervalMinutes: waitlistInterval === '' ? '' : parseInt(waitlistInterval, 10),
          notifyDeadlineMinutes: waitlistDeadline === '' ? '' : parseInt(waitlistDeadline, 10)
        }
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings5SavedMsg) settings5SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('メニュー関係の保存エラー:', error);
      if (settings5Error) {
        settings5Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings5Error.style.display = 'block';
      }
    } finally {
      if (saveSettings5Btn) {
        saveSettings5Btn.disabled = false;
        saveSettings5Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 「営業時間」タブの現在値を取得し、フォームに反映する
 */
async function loadSettings6() {
  if (settings6Loading) settings6Loading.style.display = 'block';
  if (settings6Error) settings6Error.style.display = 'none';
  if (settings6Form) settings6Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage6');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    renderBusinessHoursRows(result.business || {}, result.lastOrderOverride || {});
    renderSlotStepOverrideRows(result.displaySlotStepOverride || {});
    if (s6HolidayCalendarId) s6HolidayCalendarId.value = result.holidayCalendarId || '';

    settings6Loaded = true;
    if (settings6Form) settings6Form.style.display = 'block';
  } catch (error) {
    console.error('営業時間の取得エラー:', error);
    if (settings6Error) {
      settings6Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings6Error.style.display = 'block';
    }
  } finally {
    if (settings6Loading) settings6Loading.style.display = 'none';
  }
}

if (settings6Form) {
  settings6Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings6Error) settings6Error.style.display = 'none';
    if (settings6SavedMsg) settings6SavedMsg.style.display = 'none';
    if (saveSettings6Btn) {
      saveSettings6Btn.disabled = true;
      saveSettings6Btn.textContent = '保存中...';
    }

    try {
      const business = {};
      document.querySelectorAll('.business-hours-row').forEach(row => {
        const day = row.getAttribute('data-day');
        const openVal = row.querySelector('.business-open-input').value;
        const closeVal = row.querySelector('.business-close-input').value;
        if (openVal !== '' && closeVal !== '') {
          business[day] = [parseInt(openVal, 10), parseInt(closeVal, 10)];
        }
      });

      const lastOrderOverride = {};
      document.querySelectorAll('.last-order-row').forEach(row => {
        const day = row.getAttribute('data-day');
        const check = row.querySelector('.last-order-check');
        if (!check.checked) return;

        const lastOrderTime = getTimeFromSelects(row, 'last-order-time-select');
        const closeTime = getTimeFromSelects(row, 'last-order-close-select');
        if (lastOrderTime && closeTime) {
          lastOrderOverride[day] = { lastOrderTime: lastOrderTime, closeTime: closeTime };
        }
      });

      const displaySlotStepOverride = {};
      document.querySelectorAll('.slot-step-override-row').forEach(row => {
        const day = row.getAttribute('data-day');
        const check = row.querySelector('.slot-override-check');
        if (!check.checked) return;

        const startTime = getTimeFromSelects(row, 'slot-override-start-select');
        const endTime = getTimeFromSelects(row, 'slot-override-end-select');
        const stepMinutes = parseInt(row.querySelector('.slot-override-minutes-input').value, 10);
        if (startTime && endTime && !isNaN(stepMinutes) && stepMinutes > 0) {
          displaySlotStepOverride[day] = { startTime: startTime, endTime: endTime, stepMinutes: stepMinutes };
        }
      });

      const settings = {
        BUSINESS: business,
        LAST_ORDER_OVERRIDE: lastOrderOverride,
        DISPLAY_SLOT_STEP_OVERRIDE: displaySlotStepOverride,
        HOLIDAY_CALENDAR_ID: s6HolidayCalendarId.value.trim()
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings6SavedMsg) settings6SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('営業時間の保存エラー:', error);
      if (settings6Error) {
        settings6Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings6Error.style.display = 'block';
      }
    } finally {
      if (saveSettings6Btn) {
        saveSettings6Btn.disabled = false;
        saveSettings6Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 「設定1」タブ（スタッフ・カレンダーID・担当スタッフの選択）の現在値を取得し、フォームに反映する
 */
async function loadSettings4() {
  if (settings4Loading) settings4Loading.style.display = 'block';
  if (settings4Error) settings4Error.style.display = 'none';
  if (settings4Form) settings4Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage4');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    renderStaffNameRows(result.staffMaster || {});

    if (s4ShowStaffSelector) s4ShowStaffSelector.checked = result.showStaffSelector !== false;
    if (s4AllowNoAssign) s4AllowNoAssign.checked = !!result.allowNoAssign;
    if (s4NoAssignLabel) s4NoAssignLabel.value = result.noAssignLabel || '';
    if (s4NoAssignCalendarId) s4NoAssignCalendarId.value = result.noAssignCalendarId || '';
    setRadioValue('s4-no-assign-mode', String(result.noAssignMode));
    setRadioValue('s4-no-assign-type', result.noAssignType);

    settings4Loaded = true;
    if (settings4Form) settings4Form.style.display = 'block';
  } catch (error) {
    console.error('設定1の取得エラー:', error);
    if (settings4Error) {
      settings4Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings4Error.style.display = 'block';
    }
  } finally {
    if (settings4Loading) settings4Loading.style.display = 'none';
  }
}

if (settings4Form) {
  settings4Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings4Error) settings4Error.style.display = 'none';
    if (settings4SavedMsg) settings4SavedMsg.style.display = 'none';
    if (saveSettings4Btn) {
      saveSettings4Btn.disabled = true;
      saveSettings4Btn.textContent = '保存中...';
    }

    try {
      // スタッフ名・カレンダーID（両方入力されている行だけを対象にする）
      const staffMaster = {};
      document.querySelectorAll('.staff-name-row').forEach(row => {
        const name = row.querySelector('.staff-name-input').value.trim();
        const calendarId = row.querySelector('.staff-calendar-id-input').value.trim();
        if (name && calendarId) {
          staffMaster[name] = calendarId;
        }
      });

      const settings = {
        STAFF_MASTER: staffMaster,
        SHOW_STAFF_SELECTOR: !!s4ShowStaffSelector.checked,
        ALLOW_NO_ASSIGN: !!s4AllowNoAssign.checked,
        NO_ASSIGN_LABEL: s4NoAssignLabel.value.trim() || '指名なし',
        NO_ASSIGN_CALENDAR_ID: s4NoAssignCalendarId.value.trim(),
        NO_ASSIGN_MODE: parseInt(getRadioValue('s4-no-assign-mode'), 10) || 2,
        NO_ASSIGN_TYPE: getRadioValue('s4-no-assign-type') || 'TYPE_B'
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings4SavedMsg) settings4SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('設定1の保存エラー:', error);
      if (settings4Error) {
        settings4Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings4Error.style.display = 'block';
      }
    } finally {
      if (saveSettings4Btn) {
        saveSettings4Btn.disabled = false;
        saveSettings4Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 「設定2」タブの現在値を取得し、フォームに反映する
 */
async function loadSettings2() {
  if (settings2Loading) settings2Loading.style.display = 'block';
  if (settings2Error) settings2Error.style.display = 'none';
  if (settings2Form) settings2Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage2');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    if (s2ReminderDays) s2ReminderDays.value = result.reminderMailDaysBefore;
    if (s2ReservationSiteUrl) s2ReservationSiteUrl.value = result.reservationSiteUrl || '';
    renderAdminEmailRows(result.adminEmail || '');
    if (s2CalendarSalonName) s2CalendarSalonName.value = result.calendarSalonName || '';

    if (s2MailHeader) s2MailHeader.value = result.customerMailHeader || '';
    if (s2MailFooter) s2MailFooter.value = result.customerMailFooter || '';

    // 来店後のお礼メール（口コミ・クチコミ導線）
    const thankYouMail = result.thankYouMail || {};
    if (s2ThankYouEnabled) s2ThankYouEnabled.checked = !!thankYouMail.enabled;
    if (s2ThankYouDays) s2ThankYouDays.value = thankYouMail.daysAfterVisit || '';
    if (s2ThankYouHeader) s2ThankYouHeader.value = thankYouMail.header || '';
    if (s2ThankYouFooter) s2ThankYouFooter.value = thankYouMail.footer || '';
    if (s2ThankYouReviewUrl) s2ThankYouReviewUrl.value = thankYouMail.reviewUrl || '';

    settings2Loaded = true;
    if (settings2Form) settings2Form.style.display = 'block';
  } catch (error) {
    console.error('設定2の取得エラー:', error);
    if (settings2Error) {
      settings2Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings2Error.style.display = 'block';
    }
  } finally {
    if (settings2Loading) settings2Loading.style.display = 'none';
  }
}

/**
 * name属性を指定して、ラジオボタンのうち該当する値のものだけをチェックする
 * @param {string} name - ラジオボタンのname属性
 * @param {string} value - チェックしたい値
 */
function setRadioValue(name, value) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach(radio => {
    radio.checked = (radio.value === value);
  });
}

/**
 * チェックされているラジオボタンの値を取得する
 * @param {string} name - ラジオボタンのname属性
 * @returns {string|null}
 */
function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

if (settings2Form) {
  settings2Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings2Error) settings2Error.style.display = 'none';
    if (settings2SavedMsg) settings2SavedMsg.style.display = 'none';
    if (saveSettings2Btn) {
      saveSettings2Btn.disabled = true;
      saveSettings2Btn.textContent = '保存中...';
    }

    try {
      const settings = {
        REMINDER_MAIL_DAYS_BEFORE: parseInt(s2ReminderDays.value, 10),
        RESERVATION_SITE_URL: s2ReservationSiteUrl.value.trim(),
        ADMIN_EMAIL: collectAdminEmails(),
        CALENDAR_SALON_NAME: s2CalendarSalonName.value.trim(),
        CUSTOMER_MAIL_HEADER: s2MailHeader.value,
        CUSTOMER_MAIL_FOOTER: s2MailFooter.value,
        THANK_YOU_MAIL: {
          enabled: !!s2ThankYouEnabled.checked,
          daysAfterVisit: parseInt(s2ThankYouDays.value, 10) || 0,
          header: s2ThankYouHeader.value,
          footer: s2ThankYouFooter.value,
          reviewUrl: s2ThankYouReviewUrl.value.trim()
        }
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings2SavedMsg) settings2SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('設定2の保存エラー:', error);
      if (settings2Error) {
        settings2Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings2Error.style.display = 'block';
      }
    } finally {
      if (saveSettings2Btn) {
        saveSettings2Btn.disabled = false;
        saveSettings2Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 「設定3」タブの現在値を取得し、フォームに反映する
 */
async function loadSettings3() {
  if (settings3Loading) settings3Loading.style.display = 'block';
  if (settings3Error) settings3Error.style.display = 'none';
  if (settings3Form) settings3Form.style.display = 'none';

  try {
    const result = await callAdminApi('getSettingsPage3');
    if (!result.success) throw new Error(result.message || '設定の取得に失敗しました。');

    // 店名・ロゴ
    const branding = result.headerBranding || {};
    if (s3ShopName) s3ShopName.value = branding.shopName || '';
    if (s3ShopNameFontSize) s3ShopNameFontSize.value = branding.titleFontSize || '';
    if (s3ShopNameColor) s3ShopNameColor.value = branding.titleColor || '';
    if (s3ShopNameFontFamily) s3ShopNameFontFamily.value = branding.titleFontFamily || '';
    if (s3LogoUrl) s3LogoUrl.value = branding.logoUrl || '';

    // 連絡先情報
    const contact = result.headerContactInfo || {};
    if (s3ContactPhone) s3ContactPhone.value = contact.phone || '';
    if (s3ContactHours) s3ContactHours.value = contact.hours || '';
    if (s3ContactClosed) s3ContactClosed.value = contact.closedDay || '';

    // トップページに戻るボタン
    if (s3HomeUrl) s3HomeUrl.value = result.homePageUrl || '';
    if (s3HomeLabel) s3HomeLabel.value = result.homePageLabel || '';

    // 情報セクション
    const info = result.infoSection || {};
    if (s3InfoEnabled) s3InfoEnabled.checked = !!info.enabled;
    if (s3InfoHeading) s3InfoHeading.value = (info.heading && info.heading.text) || '';
    if (s3InfoHeadingFontSize) s3InfoHeadingFontSize.value = (info.heading && info.heading.fontSize) || '';
    if (s3InfoHeadingColor) s3InfoHeadingColor.value = (info.heading && info.heading.color) || '';
    if (s3InfoHeadingFontFamily) s3InfoHeadingFontFamily.value = (info.heading && info.heading.fontFamily) || '';
    renderInfoItemRows(info.items || []);

    settings3Loaded = true;
    if (settings3Form) settings3Form.style.display = 'block';
  } catch (error) {
    console.error('設定3の取得エラー:', error);
    if (settings3Error) {
      settings3Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      settings3Error.style.display = 'block';
    }
  } finally {
    if (settings3Loading) settings3Loading.style.display = 'none';
  }
}

/**
 * 情報カード（タイトル＋説明文）用の翻訳入力欄HTMLを作る
 * @param {Object} i18nValues - { en: {title, description}, ko: {...}, ... }
 * @returns {string}
 */
function buildInfoI18nPanelHtml(i18nValues) {
  const values = i18nValues || {};
  return I18N_TARGET_LANGS.map(lang => {
    const v = values[lang.code] || {};
    return `
      <div class="i18n-panel-row info-i18n-row">
        <span class="i18n-panel-lang-label">${lang.label}</span>
        <div class="info-i18n-fields">
          <input type="text" class="info-i18n-title-input" data-lang="${lang.code}" value="${escapeHtmlAdmin(v.title || '')}" placeholder="タイトルの翻訳">
          <input type="text" class="info-i18n-desc-input" data-lang="${lang.code}" value="${escapeHtmlAdmin(v.description || '')}" placeholder="説明文の翻訳">
        </div>
        <a href="#" target="_blank" rel="noopener" class="i18n-translate-link" data-lang="${lang.code}">Google翻訳で開く ↗</a>
      </div>
    `;
  }).join('');
}

/**
 * 情報セクションのカード入力欄（固定4枠）を描画する
 * @param {Array} items - 既存のカード設定（0〜4件）
 */
function renderInfoItemRows(items) {
  if (!infoItemRows) return;

  const iconOptionsHtml = INFO_ICON_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');

  let html = '';
  for (let i = 0; i < 4; i++) {
    const item = items[i] || {};
    const isUrlType = !!item.url && !item.page;
    const showIcon = item.showIcon !== false; // 未指定の場合は「使う」扱い
    const iconValue = item.icon || '';
    const isIconUrlType = /^https?:\/\//i.test(iconValue);

    html += `
      <div class="info-item-block" data-slot="${i}">
        <div class="info-item-block-title">カード${i + 1}（空欄のままなら、このカードは表示されません）</div>

        <div class="form-group checkbox-group">
          <label><input type="checkbox" class="info-show-icon-check" ${showIcon ? 'checked' : ''}> アイコンを使う</label>
        </div>
        <div class="info-icon-settings" style="${showIcon ? '' : 'display: none;'}">
          <div class="info-item-link-type">
            <label><input type="radio" name="info-icon-type-${i}" value="preset" ${!isIconUrlType ? 'checked' : ''}> 用意されたアイコンから選ぶ</label>
            <label><input type="radio" name="info-icon-type-${i}" value="image" ${isIconUrlType ? 'checked' : ''}> 画像URLを指定する</label>
          </div>
          <div class="form-group info-icon-preset-group" style="${isIconUrlType ? 'display: none;' : ''}">
            <label>アイコンの種類</label>
            <select class="info-icon-select">${iconOptionsHtml}</select>
          </div>
          <div class="form-group info-icon-image-group" style="${isIconUrlType ? '' : 'display: none;'}">
            <label>アイコン画像のURL</label>
            <input type="text" class="info-icon-image-input" value="${escapeHtmlAdmin(isIconUrlType ? iconValue : '')}" placeholder="https://example.com/icon.png">
          </div>
        </div>

        <div class="form-group">
          <label>タイトル</label>
          <input type="text" class="info-title-input" value="${escapeHtmlAdmin(item.title || '')}" placeholder="例：お店情報">
        </div>
        <div class="form-group font-style-group">
          <label>タイトルの文字サイズ・px単位</label>
          <input type="text" class="info-title-font-size-input" value="${escapeHtmlAdmin(item.titleFontSize || '')}" placeholder="例：16px（未入力で標準サイズ）">
        </div>
        <div class="form-group font-style-group">
          <label>タイトルの文字色</label>
          <input type="text" class="info-title-color-input" value="${escapeHtmlAdmin(item.titleColor || '')}" placeholder="例：#3d2f24（未入力で標準色）">
        </div>
        <div class="form-group font-style-group">
          <label>タイトルのフォント</label>
          <p class="i18n-panel-note">「丸ゴシック」「明朝」「ゴシック」という言葉で入力すると、それらしいフォントを自動で読み込んで表示します。実在するフォント名を直接指定することもできます。</p>
          <input type="text" class="info-title-font-family-input" value="${escapeHtmlAdmin(item.titleFontFamily || '')}" placeholder="例：丸ゴシック（未入力で標準フォント）">
        </div>
        <div class="form-group">
          <label>説明文</label>
          <input type="text" class="info-desc-input" value="${escapeHtmlAdmin(item.description || '')}" placeholder="例：サロンの詳しい情報はこちら">
        </div>
        <button type="button" class="btn-i18n-toggle btn-info-i18n-toggle" data-slot="${i}">🌐 多言語対応サイト向けの翻訳を編集</button>
        <div class="menu-i18n-panel info-i18n-panel" data-slot="${i}" style="display: none;">
          <p class="i18n-panel-note">未入力の言語は、日本語のタイトル・説明文がそのまま表示されます</p>
          ${buildInfoI18nPanelHtml(item.i18n || {})}
        </div>
        <div class="info-item-link-type">
          <label><input type="radio" name="info-link-type-${i}" value="page" ${!isUrlType ? 'checked' : ''}> サイト内のページ（1〜4）</label>
          <label><input type="radio" name="info-link-type-${i}" value="url" ${isUrlType ? 'checked' : ''}> 外部URL</label>
        </div>
        <div class="form-group">
          <label>ページ番号 または URL</label>
          <input type="text" class="info-link-value-input" value="${escapeHtmlAdmin(isUrlType ? item.url : (item.page || ''))}" placeholder="例：1 または https://example.com">
        </div>
      </div>
    `;
  }
  infoItemRows.innerHTML = html;

  // 翻訳パネルの開閉・Google翻訳リンクの更新
  infoItemRows.querySelectorAll('.btn-info-i18n-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.getAttribute('data-slot');
      const block = infoItemRows.querySelector(`.info-item-block[data-slot="${slot}"]`);
      const panel = infoItemRows.querySelector(`.info-i18n-panel[data-slot="${slot}"]`);
      if (!block || !panel) return;

      const titleVal = block.querySelector('.info-title-input').value.trim();
      const descVal = block.querySelector('.info-desc-input').value.trim();
      refreshI18nTranslateLinks(panel, `${titleVal}\n${descVal}`);
      panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    });
  });

  // 読み込んだアイコンの選択状態を反映する（HTML文字列にselectedを埋め込むより、後からJSで設定する方が安全）
  items.forEach((item, i) => {
    const select = infoItemRows.querySelector(`.info-item-block[data-slot="${i}"] .info-icon-select`);
    if (select && item.icon && !/^https?:\/\//i.test(item.icon)) select.value = item.icon;
  });

  // 「アイコンを使う」チェックの切り替えで、アイコン設定エリア自体を表示・非表示にする
  infoItemRows.querySelectorAll('.info-show-icon-check').forEach(check => {
    check.addEventListener('change', () => {
      const settingsArea = check.closest('.info-item-block').querySelector('.info-icon-settings');
      if (settingsArea) settingsArea.style.display = check.checked ? 'block' : 'none';
    });
  });

  // 「プリセット / 画像URL」の切り替えで、該当する入力欄だけを表示する
  infoItemRows.querySelectorAll('.info-item-block').forEach(block => {
    const presetGroup = block.querySelector('.info-icon-preset-group');
    const imageGroup = block.querySelector('.info-icon-image-group');
    block.querySelectorAll('input[type="radio"][name^="info-icon-type-"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked && radio.value === 'preset') {
          if (presetGroup) presetGroup.style.display = 'block';
          if (imageGroup) imageGroup.style.display = 'none';
        } else if (radio.checked && radio.value === 'image') {
          if (presetGroup) presetGroup.style.display = 'none';
          if (imageGroup) imageGroup.style.display = 'block';
        }
      });
    });
  });
}

if (settings3Form) {
  settings3Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (settings3Error) settings3Error.style.display = 'none';
    if (settings3SavedMsg) settings3SavedMsg.style.display = 'none';
    if (saveSettings3Btn) {
      saveSettings3Btn.disabled = true;
      saveSettings3Btn.textContent = '保存中...';
    }

    try {
      // 店名・ロゴ（両方空なら null にして「未設定」に戻す）
      const shopName = s3ShopName.value.trim();
      const logoUrl = s3LogoUrl.value.trim();
      const shopNameFontSize = s3ShopNameFontSize.value.trim();
      const shopNameColor = s3ShopNameColor.value.trim();
      const shopNameFontFamily = s3ShopNameFontFamily.value.trim();
      const headerBranding = (shopName || logoUrl || shopNameFontSize || shopNameColor || shopNameFontFamily)
        ? {
            shopName: shopName || null,
            logoUrl: logoUrl || null,
            titleFontSize: shopNameFontSize || null,
            titleColor: shopNameColor || null,
            titleFontFamily: shopNameFontFamily || null
          }
        : null;

      // 連絡先情報
      const phone = s3ContactPhone.value.trim();
      const hours = s3ContactHours.value.trim();
      const closedDay = s3ContactClosed.value.trim();
      const headerContactInfo = (phone || hours || closedDay) ? { phone: phone || null, hours: hours || null, closedDay: closedDay || null } : null;

      const settings = {
        HEADER_BRANDING: headerBranding,
        HEADER_CONTACT_INFO: headerContactInfo,
        HOME_PAGE_URL: s3HomeUrl.value.trim() || null,
        HOME_PAGE_LABEL: s3HomeLabel.value.trim() || null,
        INFO_SECTION: {
          enabled: !!s3InfoEnabled.checked,
          heading: {
            text: s3InfoHeading.value.trim() || null,
            fontSize: s3InfoHeadingFontSize.value.trim() || null,
            color: s3InfoHeadingColor.value.trim() || null,
            fontFamily: s3InfoHeadingFontFamily.value.trim() || null
          },
          items: collectInfoItems()
        }
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (settings3SavedMsg) settings3SavedMsg.style.display = 'block';
    } catch (error) {
      console.error('設定3の保存エラー:', error);
      if (settings3Error) {
        settings3Error.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        settings3Error.style.display = 'block';
      }
    } finally {
      if (saveSettings3Btn) {
        saveSettings3Btn.disabled = false;
        saveSettings3Btn.textContent = '保存する';
      }
    }
  });
}

/**
 * 情報セクションの4枠から、タイトルが入力されているものだけを取り出して配列にする
 * @returns {Array} INFO_SECTION.items に渡す配列
 */
function collectInfoItems() {
  const items = [];
  document.querySelectorAll('.info-item-block').forEach(block => {
    const title = block.querySelector('.info-title-input').value.trim();
    if (!title) return; // タイトル未入力の枠は、カードとして保存しない

    const description = block.querySelector('.info-desc-input').value.trim();
    const titleFontSize = block.querySelector('.info-title-font-size-input').value.trim();
    const titleColor = block.querySelector('.info-title-color-input').value.trim();
    const titleFontFamily = block.querySelector('.info-title-font-family-input').value.trim();
    const slot = block.getAttribute('data-slot');
    const linkType = getRadioValue(`info-link-type-${slot}`);
    const linkValue = block.querySelector('.info-link-value-input').value.trim();

    const showIcon = block.querySelector('.info-show-icon-check').checked;
    const iconType = getRadioValue(`info-icon-type-${slot}`);
    const icon = (showIcon && iconType === 'image')
      ? block.querySelector('.info-icon-image-input').value.trim()
      : block.querySelector('.info-icon-select').value;

    const item = { icon: icon, showIcon: showIcon, title: title, description: description, titleFontSize: titleFontSize || null, titleColor: titleColor || null, titleFontFamily: titleFontFamily || null };

    // 翻訳パネルから、入力済みの翻訳を集める（タイトル・説明文どちらか入っていればその言語を保存）
    const panel = document.querySelector(`.info-i18n-panel[data-slot="${slot}"]`);
    const i18n = {};
    if (panel) {
      I18N_TARGET_LANGS.forEach(lang => {
        const titleInput = panel.querySelector(`.info-i18n-title-input[data-lang="${lang.code}"]`);
        const descInput = panel.querySelector(`.info-i18n-desc-input[data-lang="${lang.code}"]`);
        const titleVal = titleInput ? titleInput.value.trim() : '';
        const descVal = descInput ? descInput.value.trim() : '';
        if (titleVal || descVal) {
          i18n[lang.code] = { title: titleVal, description: descVal };
        }
      });
    }
    item.i18n = i18n;

    if (linkType === 'url') {
      item.url = linkValue;
    } else {
      const pageNum = parseInt(linkValue, 10);
      if (!isNaN(pageNum)) item.page = pageNum;
    }
    items.push(item);
  });
  return items;
}

if (runReportBtn) {
  runReportBtn.addEventListener('click', runReport);
}

/**
 * 「アカウント管理」タブの現在値（登録済みアカウント一覧）を取得し、表示する
 */
async function loadAccounts() {
  if (accountsLoading) accountsLoading.style.display = 'block';
  if (accountsError) accountsError.style.display = 'none';

  try {
    const result = await callAdminApi('getAdminAccounts');
    if (!result.success) throw new Error(result.message || 'アカウント一覧の取得に失敗しました。');

    renderAccounts(result.accounts || []);
    accountsLoaded = true;
  } catch (error) {
    console.error('アカウント一覧の取得エラー:', error);
    if (accountsError) {
      accountsError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      accountsError.style.display = 'block';
    }
  } finally {
    if (accountsLoading) accountsLoading.style.display = 'none';
  }
}

/**
 * アカウント一覧を表として描画する（自分自身の行には削除ボタンを出さない）
 * @param {Array<Object>} accounts - { loginId, displayName } の配列
 */
function renderAccounts(accounts) {
  if (!accountsTbody) return;

  const myLoginId = sessionStorage.getItem(SESSION_DISPLAY_NAME_KEY); // 表示名しか保持していないため、削除可否はサーバー側の最終チェックに委ねる

  if (accounts.length === 0) {
    accountsTbody.innerHTML = '<tr><td colspan="3">登録されているアカウントはありません。</td></tr>';
    return;
  }

  accountsTbody.innerHTML = accounts.map(acc => `
    <tr>
      <td>${escapeHtmlAdmin(acc.loginId)}</td>
      <td>${escapeHtmlAdmin(acc.displayName)}</td>
      <td><button type="button" class="btn-remove-row delete-account-btn" data-login-id="${escapeHtmlAdmin(acc.loginId)}" title="このアカウントを削除">×</button></td>
    </tr>
  `).join('');

  accountsTbody.querySelectorAll('.delete-account-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteAccount(btn.getAttribute('data-login-id')));
  });
}

/**
 * アカウント削除ボタンが押された時の処理（確認ダイアログを挟んでから実行する）
 * @param {string} targetLoginId
 */
async function handleDeleteAccount(targetLoginId) {
  if (!confirm(`ログインID「${targetLoginId}」のアカウントを削除しますか？この操作は取り消せません。`)) return;

  if (accountsError) accountsError.style.display = 'none';

  try {
    const result = await callAdminApi('deleteAdminAccount', { targetLoginId: targetLoginId });
    if (!result.success) throw new Error(result.message || '削除に失敗しました。');

    await loadAccounts();
  } catch (error) {
    console.error('アカウント削除エラー:', error);
    if (accountsError) {
      accountsError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      accountsError.style.display = 'block';
    }
  }
}

if (addAccountForm) {
  addAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (addAccountError) addAccountError.style.display = 'none';
    if (addAccountSavedMsg) addAccountSavedMsg.style.display = 'none';
    if (addAccountBtn) {
      addAccountBtn.disabled = true;
      addAccountBtn.textContent = '追加中...';
    }

    try {
      const newLoginId = newLoginIdInput.value.trim();
      const newPassword = newPasswordInput.value;
      const newDisplayName = newDisplayNameInput.value.trim();

      const result = await callAdminApi('addAdminAccount', {
        newLoginId: newLoginId,
        newPassword: newPassword,
        newDisplayName: newDisplayName
      });

      if (!result.success) throw new Error(result.message || '追加に失敗しました。');

      if (addAccountSavedMsg) addAccountSavedMsg.style.display = 'block';
      addAccountForm.reset();
      await loadAccounts();
    } catch (error) {
      console.error('アカウント追加エラー:', error);
      if (addAccountError) {
        addAccountError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        addAccountError.style.display = 'block';
      }
    } finally {
      if (addAccountBtn) {
        addAccountBtn.disabled = false;
        addAccountBtn.textContent = '追加する';
      }
    }
  });
}

/**
 * ページを開いた時、既にログイン済み（ブラウザのタブ内にセッショントークンが残っている）かどうか確認する
 */
async function checkExistingSession() {
  const savedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!savedToken) {
    showDashboard(false);
    return;
  }

  const result = await callAdminApi('verifyAdminSession');
  if (result && result.success) {
    showWelcomeMessage(result.displayName || sessionStorage.getItem(SESSION_DISPLAY_NAME_KEY));
    showDashboard(true);
  } else {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DISPLAY_NAME_KEY);
    showDashboard(false);
  }
}

/**
 * ヘッダーに「ようこそ、〇〇さん」を表示する
 * @param {string} displayName
 */
function showWelcomeMessage(displayName) {
  if (welcomeMessage && displayName) {
    welcomeMessage.textContent = `ようこそ、${displayName}さん`;
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (loginError) loginError.style.display = 'none';
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = '確認中...';
    }

    try {
      const loginId = adminLoginIdInput ? adminLoginIdInput.value.trim() : '';
      const password = adminPasswordInput ? adminPasswordInput.value : '';
      const result = await callAdminApi('adminLogin', { loginId: loginId, password: password });

      if (result && result.success) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, result.token);
        sessionStorage.setItem(SESSION_DISPLAY_NAME_KEY, result.displayName || loginId);
        showWelcomeMessage(result.displayName || loginId);
        showDashboard(true);
      } else {
        if (loginError) {
          loginError.textContent = (result && result.message) || 'ログインIDまたはパスワードが正しくありません。';
          loginError.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('ログイン処理エラー:', error);
      if (loginError) {
        loginError.textContent = '通信エラーが発生しました。時間をおいて再度お試しください。';
        loginError.style.display = 'block';
      }
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = 'ログイン';
      }
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DISPLAY_NAME_KEY);
    showDashboard(false);
    if (adminPasswordInput) adminPasswordInput.value = '';
    if (adminLoginIdInput) adminLoginIdInput.value = '';
  });
}

/**
 * ログイン画面 ⇔「パスワードを忘れた場合」画面の切り替え
 */
if (showForgotPasswordBtn) {
  showForgotPasswordBtn.addEventListener('click', () => {
    if (loginForm) loginForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
    if (loginError) loginError.style.display = 'none';
  });
}

if (backToLoginBtn) {
  backToLoginBtn.addEventListener('click', () => {
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (forgotPasswordError) forgotPasswordError.style.display = 'none';
    if (forgotPasswordSentMsg) forgotPasswordSentMsg.style.display = 'none';
    if (forgotPasswordBtn) {
      forgotPasswordBtn.disabled = true;
      forgotPasswordBtn.textContent = '送信中...';
    }

    try {
      const email = forgotEmailInput ? forgotEmailInput.value.trim() : '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'requestPasswordReset', email: email })
      });
      const result = await response.json();

      if (forgotPasswordSentMsg) {
        forgotPasswordSentMsg.textContent = result.message || '再設定メールを送信しました。';
        forgotPasswordSentMsg.style.display = 'block';
      }
      forgotPasswordForm.reset();
    } catch (error) {
      console.error('パスワード再設定リクエストエラー:', error);
      if (forgotPasswordError) {
        forgotPasswordError.textContent = '通信エラーが発生しました。時間をおいて再度お試しください。';
        forgotPasswordError.style.display = 'block';
      }
    } finally {
      if (forgotPasswordBtn) {
        forgotPasswordBtn.disabled = false;
        forgotPasswordBtn.textContent = '再設定メールを送る';
      }
    }
  });
}

/**
 * メール内のリンク（?resetToken=...）から開かれた場合、新しいパスワード入力画面を表示する
 */
let currentResetToken = null;

function checkResetTokenInUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('resetToken');

  if (tokenFromUrl) {
    currentResetToken = tokenFromUrl;
    if (loginForm) loginForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (resetPasswordForm) resetPasswordForm.style.display = 'block';
    return true;
  }
  return false;
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (resetPasswordError) resetPasswordError.style.display = 'none';
    if (resetPasswordDoneMsg) resetPasswordDoneMsg.style.display = 'none';
    if (resetPasswordBtn) {
      resetPasswordBtn.disabled = true;
      resetPasswordBtn.textContent = '再設定中...';
    }

    try {
      const newPassword = resetNewPasswordInput ? resetNewPasswordInput.value : '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'resetPasswordWithToken', resetToken: currentResetToken, newPassword: newPassword })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '再設定に失敗しました。');

      if (resetPasswordDoneMsg) {
        resetPasswordDoneMsg.textContent = result.message || 'パスワードを再設定しました。';
        resetPasswordDoneMsg.style.display = 'block';
      }
      resetPasswordForm.reset();

      // 少し待ってから、通常のログイン画面に戻す
      setTimeout(() => {
        if (resetPasswordForm) resetPasswordForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        // URLの ?resetToken= を消しておく（リロード時に再設定画面へ戻らないように）
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);
    } catch (error) {
      console.error('パスワード再設定エラー:', error);
      if (resetPasswordError) {
        resetPasswordError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        resetPasswordError.style.display = 'block';
      }
    } finally {
      if (resetPasswordBtn) {
        resetPasswordBtn.disabled = false;
        resetPasswordBtn.textContent = 'パスワードを再設定する';
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (!checkResetTokenInUrl()) {
    checkExistingSession();
  }
});
