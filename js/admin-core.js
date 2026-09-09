/**
 * =================================================================
 * Salon Information System (SIS) - js/admin-core.js [Version 1.0.0]
 * [役割: 管理画面のログイン・セッション維持・ログアウト、タブ切り替え、共通ヘルパー、全DOM参照]
 * 読み込み順: config.js → admin-core.js → admin-reports.js → admin-settings.js
 *            → admin-accounts.js（この順で読み込むこと。他のadmin-*.jsより先に読み込む）
 * このファイルで定義しているDOM要素の定数（const）・共通の状態変数は、後続の
 * admin-reports.js・admin-settings.js・admin-accounts.jsからもそのまま参照できる
 * （同じグローバルスコープのため）
 * =================================================================
 */

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
const saveSettings3Btn = document.getElementById('save-settings3-btn');

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
      if (targetTab === 'pages' && !pageEditLoaded) {
        loadPageContents();
      }
    });
  });
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
