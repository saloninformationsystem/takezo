/**
 * =================================================================
 * Salon Information System (SIS) - js/ui.js [Version 4.4.4]
 * [役割: DOM操作・UI制御・イベントハンドリング（予約検索・変更・キャンセルは booking.js へ分離）]
 * =================================================================
 */

// -----------------------------------------------------------------
// 0. 情報セクション用アイコンライブラリ
// 今後アイコンを増やしたい時は、この辞書にキーとSVGを追加するだけでよい
// -----------------------------------------------------------------
const INFO_CARD_ICONS = {
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9.5"/><path d="M3 4h18l1.2 5.2a2 2 0 0 1-2 2.4h-.4a2 2 0 0 1-2-1.7 2 2 0 0 1-2 1.7 2 2 0 0 1-2-1.7 2 2 0 0 1-2 1.7 2 2 0 0 1-2-1.7 2 2 0 0 1-2 1.7h-.4a2 2 0 0 1-2-2.4L3 4z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-6-2.5V4.5L9 7l6-2.5 6 2.5v13l-6-2.5-6 2.5z"/><path d="M9 7v13"/><path d="M15 4.5v13"/></svg>',
  staff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/><circle cx="17" cy="7" r="2.4"/><path d="M15.5 13.3c2.6.5 4.5 2.7 4.5 5.4"/></svg>',
  price: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5l6 7.5l6-7.5"/><path d="M12 12.5V20"/><path d="M7 13.5h10"/><path d="M7 16.5h10"/></svg>',
  scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8 8l12 12"/><path d="M8 16L20 4"/></svg>',
  coupon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.7 1.7 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.7 1.7 0 0 0 0-3V9z"/><path d="M9 7v10" stroke-dasharray="2 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.2l1.6 4.5-2 1.6a12 12 0 0 0 5.1 5.1l1.6-2 4.5 1.6V18a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-1z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9z"/></svg>'
};

// -----------------------------------------------------------------
// 1. DOM要素（画面のパーツ）の取得
// -----------------------------------------------------------------
const form = document.getElementById('reservation-form');
const nameInput = document.getElementById('name');
const nameKanaInput = document.getElementById('name_kana');
const telInput = document.getElementById('tel');
const emailInput = document.getElementById('email');
const memoInput = document.getElementById('memo');

const dateInput = document.getElementById('date');
const staffSelect = document.getElementById('staff');
const menuContainer = document.getElementById('menu-container');
const menuMultiSelectNote = document.getElementById('menu-multi-select-note');
const menuNoteTextEl = document.getElementById('menu-note-text');
const menuTotalDisplayEl = document.getElementById('menu-total-display');
const submitBtn = document.getElementById('submit-btn');
const customConfirmOverlay = document.getElementById('custom-confirm-overlay');
const customConfirmMessage = document.getElementById('custom-confirm-message');
const customConfirmOkBtn = document.getElementById('custom-confirm-ok-btn');
const customConfirmCancelBtn = document.getElementById('custom-confirm-cancel-btn');

// ナビゲーションおよび機能ボタン
const toStep2Btn = document.getElementById('to-step-2-btn');
const toStep3Btn = document.getElementById('to-step-3-btn');
const backToStep1Btn = document.getElementById('back-to-step-1-btn');
const backToStep2Btn = document.getElementById('back-to-step-2-btn');
const goToCheckBtn = document.getElementById('go-to-check-btn');
const goToCheckBtnStep2 = document.getElementById('go-to-check-btn-step2');
const homeBtn = document.getElementById('home-btn');
const shopLogo = document.getElementById('shop-logo');
const stepIndicator = document.getElementById('step-indicator');
const headerRight = document.getElementById('page-header-right');
const headerPhone = document.getElementById('header-contact-phone');
const headerPhoneText = document.getElementById('header-contact-phone-text');
const headerInfoLine = document.getElementById('header-contact-info-line');
const infoSection = document.getElementById('info-section');
const infoSectionHeading = document.getElementById('info-section-heading');
const infoCards = document.getElementById('info-cards');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');
const backFromCheckBtn = document.getElementById('back-from-check-btn');
const checkBtn = document.getElementById('check-btn');
const cancelChangeBtn = document.getElementById('cancel-change-btn');

// コンテナ（画面のブロック）および結果描画エリア
const step1Container = document.getElementById('step-1-container');
const step2Container = document.getElementById('step-2-container');
const step3Container = document.getElementById('step-3-container');
const checkTabContainer = document.getElementById('check-tab-container');
const resultsArea = document.getElementById('check-results-area');
const historyResultsArea = document.getElementById('history-results-area');
const waitlistResultsArea = document.getElementById('waitlist-results-area');
const pageFragmentContainer = document.getElementById('page-fragment-container');
const pageFragmentContent = document.getElementById('page-fragment-content');
const backToReservationBtn = document.getElementById('back-to-reservation-btn');

// タイムテーブル（時間表）表示パーツ
const timetableContainer = document.getElementById('timetable-container');
const timetableLoading = document.getElementById('timetable-loading');
const selectedDateInput = document.getElementById('selected-date');
const selectedTimeInput = document.getElementById('selected-time');
const prevTimetableBtn = document.getElementById('prev-timetable-btn');
const nextTimetableBtn = document.getElementById('next-timetable-btn');

// 予約確認タブの入力欄
const checkTelInput = document.getElementById('check-tel');
const checkEmailInput = document.getElementById('check-email');

// 変更前バナー（予約変更モード時に表示するパーツ）
const changeBannerEl = document.getElementById('change-banner');
const prevIdEl = document.getElementById('prev-id');
const prevDatetimeEl = document.getElementById('prev-datetime');
const prevMenuEl = document.getElementById('prev-menu');
const prevStaffEl = document.getElementById('prev-staff');

// -----------------------------------------------------------------
// 2. システム設定の取得（初回のみ通信）
// -----------------------------------------------------------------
/**
 * システム設定を取得する。2回目以降は保持済みの値を返して通信しない。
 * @returns {Promise<Object>} システム設定オブジェクト
 */
async function ensureSystemSettingsLoaded() {
  if (AppState.systemSettings) {
    return AppState.systemSettings;
  }

  const settings = await fetchSystemSettingsApi();

  if (!settings || settings.success === false) {
    const message = (settings && settings.message) ? settings.message : 'システム設定の読み込みに失敗しました';
    throw new Error(message);
  }

  AppState.systemSettings = settings;
  applySystemSettings(settings);
  return settings;
}

/**
 * GASから受け取った設定値をCONFIGへ反映する
 * @param {Object} settings - GASの getSystemSettings() 返却値
 */
function applySystemSettings(settings) {
  CONFIG.MAX_FUTURE_DAYS = settings.maxFutureDays;
  CONFIG.DISPLAY_DAYS = settings.displayDays;
  CONFIG.CANCEL_BUFFER_HOURS = settings.cancelBufferHours;
  CONFIG.CHANGE_BUFFER_HOURS = settings.changeBufferHours;
  CONFIG.PROVISIONAL_RESERVATION_ENABLED = !!settings.provisionalReservationEnabled;
  CONFIG.PROVISIONAL_RESERVATION_TARGET = settings.provisionalReservationTarget || "ALL";
  CONFIG.PROVISIONAL_RESERVATION_TARGET_MENUS = settings.provisionalReservationTargetMenus || [];
  CONFIG.HOME_PAGE_URL = settings.homePageUrl || null;
  CONFIG.HOME_PAGE_LABEL = settings.homePageLabel || null;
  if (homeBtn) {
    homeBtn.style.display = CONFIG.HOME_PAGE_URL ? 'inline' : 'none';
    homeBtn.textContent = `⬅ ${CONFIG.HOME_PAGE_LABEL || t('home_btn_fallback')}`;
  }

  CONFIG.HEADER_CONTACT_INFO = settings.headerContactInfo || null;
  const contactInfo = CONFIG.HEADER_CONTACT_INFO;
  if (contactInfo && (contactInfo.phone || contactInfo.hours || contactInfo.closedDay)) {
    if (headerRight) headerRight.style.display = 'block';

    if (contactInfo.phone && headerPhone && headerPhoneText) {
      headerPhoneText.textContent = contactInfo.phone;
      headerPhone.style.display = 'flex';
    }

    // 受付時間・定休日は1行にまとめて表示（両方あれば全角スペース2つで区切る）
    const infoParts = [contactInfo.hours, contactInfo.closedDay].filter(Boolean);
    if (infoParts.length > 0 && headerInfoLine) {
      headerInfoLine.textContent = infoParts.join('　　');
      headerInfoLine.style.display = 'block';
    }
  }

  CONFIG.INFO_SECTION = settings.infoSection || null;
  renderInfoSection(CONFIG.INFO_SECTION);

  CONFIG.HEADER_BRANDING = settings.headerBranding || null;
  const branding = CONFIG.HEADER_BRANDING;
  if (branding && branding.logoUrl && shopLogo) {
    shopLogo.src = branding.logoUrl;
    shopLogo.style.display = 'block';
  }
  if (branding && branding.shopName && mainTitle) {
    mainTitle.textContent = branding.shopName;
    if (mainSubtitle) mainSubtitle.style.display = 'none';
  }
  if (branding && mainTitle) {
    // 店舗名を入力していない場合（デフォルトの「SIS / Web Reservation」表示のまま）でも、
    // 中の2行（title-main・title-sub）それぞれに直接スタイルを当てて、文字サイズ等が反映されるようにする
    const titleTargets = [mainTitle, ...mainTitle.querySelectorAll('.title-main, .title-sub')];
    titleTargets.forEach(el => {
      if (branding.titleFontSize) el.style.fontSize = normalizeFontSizeValue(branding.titleFontSize);
      if (branding.titleColor) el.style.color = branding.titleColor;
      if (branding.titleFontFamily) el.style.fontFamily = normalizeFontFamilyValue(branding.titleFontFamily);
    });
  }
  CONFIG.SHOW_STAFF_SELECTOR = settings.showStaffSelector;
  CONFIG.WAITLIST_ENABLED = !!settings.waitlistEnabled;
  CONFIG.ALLOW_NO_ASSIGN = settings.allowNoAssign;
  CONFIG.NO_ASSIGN_LABEL = settings.noAssignLabel;
  CONFIG.STAFF_LIST = Array.isArray(settings.staffList) ? settings.staffList : [];
  CONFIG.MENU_SELECTOR_TYPE = settings.menuSelectorType;
  CONFIG.SHOW_MENU_MINUTES = settings.showMenuMinutes;
  CONFIG.SHOW_MENU_PRICE = settings.showMenuPrice;
  CONFIG.SHOW_MENU_TOTAL = settings.showMenuTotal;
  CONFIG.MENU_NOTE_TEXT = settings.menuNoteText || "";
  CONFIG.MENU_NOTE_TEXT_I18N = settings.menuNoteTextI18n || {};
  CONFIG.MENU_MASTER = settings.menuMaster || {};
}

/**
 * トップ下部の情報セクション（ホームページ風の案内リンク集）を描画する
 * @param {Object|null} infoConfig - CONFIG.INFO_SECTION（GASのINFO_SECTION設定）
 */
/**
 * 情報セクションのカード1件分、アイコン円の中身を組み立てる
 * - item.showIcon が false の場合：中身なし（丸だけ）
 * - item.icon が http(s):// で始まる場合：その画像を読み込んで使う
 * - それ以外：INFO_CARD_ICONS のプリセットSVGを使う（該当なしなら store のまま）
 * @param {Object} item - 情報セクションのカード設定1件分
 * @returns {string} アイコン円の中に入れるHTML
 */
function _buildInfoCardIconContent(item) {
  if (item.showIcon === false) return '';

  const iconValue = item.icon || '';
  if (/^https?:\/\//i.test(iconValue)) {
    return `<img src="${escapeHtml(iconValue)}" alt="" class="info-card-icon-img">`;
  }

  return INFO_CARD_ICONS[iconValue] || INFO_CARD_ICONS.store;
}

/**
 * 言語が切り替えられた時に呼ばれる（i18n.jsのsetLanguageから呼び出される）
 * data-i18n属性が付いた要素は自動で切り替わるが、JavaScriptで動的に組み立てている表示
 * （メニュー名・注意文など）は、ここで明示的に再描画する
 */
/**
 * 「丸ゴシック」「明朝」のような、実際のフォント名ではない“書体の種類”が入力された場合に、
 * 実在するフォント名（Googleフォント）に変換するための対応表
 */
const JAPANESE_FONT_STYLE_ALIASES = {
  '丸ゴシック': { googleFont: 'M PLUS Rounded 1c', cssValue: "'M PLUS Rounded 1c', sans-serif" },
  '丸ゴシック体': { googleFont: 'M PLUS Rounded 1c', cssValue: "'M PLUS Rounded 1c', sans-serif" },
  'ゴシック': { googleFont: 'Noto Sans JP', cssValue: "'Noto Sans JP', sans-serif" },
  'ゴシック体': { googleFont: 'Noto Sans JP', cssValue: "'Noto Sans JP', sans-serif" },
  '明朝': { googleFont: 'Noto Serif JP', cssValue: "'Noto Serif JP', serif" },
  '明朝体': { googleFont: 'Noto Serif JP', cssValue: "'Noto Serif JP', serif" }
};

// 同じGoogleフォントを何度も読み込まないよう、読み込み済みのフォント名を記録しておく
const _loadedGoogleFonts = {};

/**
 * 管理画面で入力されたフォント名の値を整える
 * 「丸ゴシック」のような“書体の種類名”が入力された場合は、実在するGoogleフォントに変換し、
 * そのフォント自体をページに自動で読み込む（どの端末で見ても同じ見た目になるようにするため）
 * @param {string} value - 入力されたフォント名（例："serif"、"丸ゴシック"、"'Yu Mincho', serif" など）
 * @returns {string} そのままCSSのfont-familyとして使える値
 */
function normalizeFontFamilyValue(value) {
  if (!value) return value;
  const trimmed = String(value).trim();
  const alias = JAPANESE_FONT_STYLE_ALIASES[trimmed];

  if (alias) {
    _loadGoogleFontIfNeeded(alias.googleFont);
    return alias.cssValue;
  }
  return trimmed;
}

/**
 * 内部ヘルパー: 指定したGoogleフォントを、ページにまだ読み込まれていなければ読み込む
 * @param {string} fontName - Googleフォントの名前（例："M PLUS Rounded 1c"）
 */
function _loadGoogleFontIfNeeded(fontName) {
  if (_loadedGoogleFonts[fontName]) return;
  _loadedGoogleFonts[fontName] = true;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * 管理画面で入力された文字サイズの値を、CSSとして正しく使える形に整える
 * 「22」のように数字だけが入力された場合、単位（px）が付いておらず無効なCSS値として
 * ブラウザに無視されてしまうため、その場合だけ自動的に「px」を補う
 * @param {string} value - 入力された文字サイズ（例："22px"、"22"、"1.2em"など）
 * @returns {string} そのまま使える文字サイズの値
 */
function normalizeFontSizeValue(value) {
  if (!value) return value;
  const trimmed = String(value).trim();
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

function onLanguageChanged() {
  if (typeof renderMenuUI === 'function') renderMenuUI();
  if (typeof renderInfoSection === 'function' && CONFIG.INFO_SECTION) renderInfoSection(CONFIG.INFO_SECTION);
}

function renderInfoSection(infoConfig) {
  if (!infoSection || !infoCards) return;

  const items = (infoConfig && Array.isArray(infoConfig.items)) ? infoConfig.items.slice(0, 4) : [];

  if (!infoConfig || !infoConfig.enabled || items.length === 0) {
    infoSection.style.display = 'none';
    return;
  }

  // 見出しの反映（未指定の項目はデフォルトのまま）
  const heading = infoConfig.heading || {};
  if (infoSectionHeading) {
    infoSectionHeading.textContent = heading.text || 'Information';
    if (heading.fontSize) infoSectionHeading.style.fontSize = normalizeFontSizeValue(heading.fontSize);
    if (heading.color) infoSectionHeading.style.color = heading.color;
    if (heading.fontFamily) infoSectionHeading.style.fontFamily = normalizeFontFamilyValue(heading.fontFamily);
  }

  // カードの生成
  // item.page が指定されていれば「予約フォーム部分だけ差し替える」内部ページカードにする
  // item.url のみの場合は、今まで通り同じタブで遷移する通常のリンクにする
  let html = '';
  items.forEach(item => {
    const iconContent = _buildInfoCardIconContent(item);
    const titleStyle = [
      item.titleFontSize ? `font-size:${escapeHtml(normalizeFontSizeValue(item.titleFontSize))}` : '',
      item.titleColor ? `color:${escapeHtml(item.titleColor)}` : '',
      item.titleFontFamily ? `font-family:${escapeHtml(normalizeFontFamilyValue(item.titleFontFamily))}` : ''
    ].filter(Boolean).join(';');

    const isInternalPage = !!item.page;
    const hrefAttr = isInternalPage ? '#' : escapeHtml(item.url || '#');
    const pageAttr = isInternalPage ? ` data-page="${escapeHtml(String(item.page))}"` : '';

    // 翻訳（i18n）が入力されていて、日本語以外が選ばれている場合は、そちらを使う
    const i18nItem = (currentLang !== 'ja' && item.i18n && item.i18n[currentLang]) ? item.i18n[currentLang] : {};
    const displayTitle = i18nItem.title || item.title || '';
    const displayDescription = i18nItem.description || item.description || '';

    html += `
      <a class="info-card" href="${hrefAttr}"${pageAttr}>
        <div class="info-card-icon">${iconContent}</div>
        <div class="info-card-title"${titleStyle ? ` style="${titleStyle}"` : ''}>${escapeHtml(displayTitle)}</div>
        <div class="info-card-description">${escapeHtml(displayDescription)}</div>
      </a>
    `;
  });

  infoCards.innerHTML = html;

  // 内部ページを参照しているカードだけ、通常の画面遷移を止めて断片読み込みに差し替える
  infoCards.querySelectorAll('.info-card[data-page]').forEach(cardEl => {
    cardEl.addEventListener('click', (e) => {
      e.preventDefault();
      loadPageFragment(cardEl.getAttribute('data-page'));
    });
  });
  infoSection.style.display = 'block';
}

/**
 * 情報セクションのカードから、pages/page(N).html を読み込んで表示する
 * ヘッダー・フッターはそのままに、予約フォーム部分だけをこの内容に差し替える
 * @param {string|number} pageNumber - ページ番号（1〜4）
 */
async function loadPageFragment(pageNumber) {
  if (!pageFragmentContainer || !pageFragmentContent) return;

  pageFragmentContent.innerHTML = `<div class="no-data">${t('page_loading')}</div>`;
  showSection(pageFragmentContainer);

  try {
    const response = await fetch(`./pages/page${pageNumber}.html`);
    if (!response.ok) throw new Error(`page${pageNumber}.html が見つかりません`);
    const html = await response.text();
    pageFragmentContent.innerHTML = html;
  } catch (error) {
    console.error('ページ断片の読み込みエラー:', error);
    pageFragmentContent.innerHTML = `<div class="no-data text-danger">${t('err_page_load_failed')}</div>`;
  }
}

// -----------------------------------------------------------------
// 3. 画面初期セットアップ
// -----------------------------------------------------------------
/**
 * カレンダーの選択可能範囲を設定する（日本時間基準）
 */
function setupDateInputRange() {
  if (!dateInput) return;

  dateInput.min = formatLocalDateInputValue(new Date());
  dateInput.max = getLocalDateAfterDays(CONFIG.MAX_FUTURE_DAYS);
}

/**
 * スタッフ選択プルダウンを構築する
 */
function setupStaffSelector() {
  if (!staffSelect) return;

  const staffGroup = document.getElementById('staff-group');
  staffSelect.innerHTML = '';

  // スタッフ選択欄を表示しない設定の場合
  if (CONFIG.SHOW_STAFF_SELECTOR === false) {
    if (staffGroup) staffGroup.style.display = 'none';

    if (CONFIG.ALLOW_NO_ASSIGN === true) {
      const noAssignOpt = document.createElement('option');
      noAssignOpt.value = CONFIG.NO_ASSIGN_LABEL;
      noAssignOpt.textContent = CONFIG.NO_ASSIGN_LABEL;
      staffSelect.appendChild(noAssignOpt);
      staffSelect.value = CONFIG.NO_ASSIGN_LABEL;
    } else if (CONFIG.STAFF_LIST.length > 0) {
      const firstStaff = CONFIG.STAFF_LIST[0];
      const opt = document.createElement('option');
      opt.value = firstStaff;
      opt.textContent = firstStaff;
      staffSelect.appendChild(opt);
      staffSelect.value = firstStaff;
    }
    return;
  }

  // スタッフ選択欄を表示する設定の場合
  if (staffGroup) staffGroup.style.display = 'flex';

  if (CONFIG.ALLOW_NO_ASSIGN === true) {
    const defaultOpt = document.createElement('option');
    defaultOpt.value = CONFIG.NO_ASSIGN_LABEL;
    defaultOpt.textContent = CONFIG.NO_ASSIGN_LABEL;
    staffSelect.appendChild(defaultOpt);
  } else {
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = t('staff_placeholder_option');
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    staffSelect.appendChild(placeholderOpt);
  }

  CONFIG.STAFF_LIST.forEach(staffName => {
    const opt = document.createElement('option');
    opt.value = staffName;
    opt.textContent = staffName;
    staffSelect.appendChild(opt);
  });
}

/**
 * システム設定をもとに画面全体を組み立てる
 */
async function initializeSystemUI() {
  try {
    await ensureSystemSettingsLoaded();
  } catch (error) {
    console.error('システム設定の読み込みに失敗しました:', error);
    if (menuContainer) {
      menuContainer.innerHTML = '<div class="note text-danger">設定の読み込みに失敗しました。時間をおいて再度お試しください。</div>';
    }
    return;
  }

  setupDateInputRange();
  setupStaffSelector();
  renderMenuUI();
}

// -----------------------------------------------------------------
// 4. メニューUI制御
// -----------------------------------------------------------------
/**
 * メニュー選択UI（プルダウン / チェックボックス）を描画する
 */
function renderMenuUI() {
  if (!menuContainer) return;

  // プルダウン式（単一選択）の時は「複数選択可」の表記を隠す
  if (menuMultiSelectNote) {
    menuMultiSelectNote.style.display = isMenuPulldownType() ? 'none' : 'inline';
  }

  const menuMaster = CONFIG.MENU_MASTER || {};
  const menuNames = Object.keys(menuMaster);

  if (menuNames.length === 0) {
    menuContainer.innerHTML = `<div class="note">${t('menu_loading')}</div>`;
    return;
  }

  let html = '';

  if (isMenuPulldownType()) {
    html += '<select id="menu-select" class="form-select menu-select-box">';
    html += `<option value="" disabled selected>${t('menu_select_placeholder')}</option>`;

    menuNames.forEach(menuName => {
      const label = buildMenuLabel(menuName, menuMaster[menuName]);
      html += `<option value="${escapeHtml(menuName)}">${escapeHtml(label)}</option>`;
    });

    html += '</select>';
  } else {
    html += '<div class="menu-checkbox-list">';

    menuNames.forEach(menuName => {
      const label = buildMenuLabel(menuName, menuMaster[menuName]);
      html += `
        <label class="checkbox-label">
          <input type="checkbox" name="selected_menus" value="${escapeHtml(menuName)}" class="menu-checkbox">
          <span>${escapeHtml(label)}</span>
        </label>
      `;
    });

    html += '</div>';
  }

  menuContainer.innerHTML = html;

  // 施術メニューの下に表示する、任意の説明文（多言語対応。翻訳が入力されていなければ日本語のまま）
  if (menuNoteTextEl) {
    const i18nNote = (currentLang !== 'ja' && CONFIG.MENU_NOTE_TEXT_I18N) ? CONFIG.MENU_NOTE_TEXT_I18N[currentLang] : "";
    const noteText = i18nNote || CONFIG.MENU_NOTE_TEXT || "";
    if (noteText) {
      menuNoteTextEl.textContent = noteText;
      menuNoteTextEl.style.display = 'block';
    } else {
      menuNoteTextEl.style.display = 'none';
    }
  }

  // 選択が変わるたびに、合計金額・合計施術時間の表示を更新する
  if (CONFIG.SHOW_MENU_TOTAL) {
    if (isMenuPulldownType()) {
      const selectEl = document.getElementById('menu-select');
      if (selectEl) selectEl.addEventListener('change', updateMenuTotalDisplay);
    } else {
      menuContainer.querySelectorAll('.menu-checkbox').forEach(cb => {
        cb.addEventListener('change', updateMenuTotalDisplay);
      });
    }
  }
  updateMenuTotalDisplay();

  // 予約変更モードの場合は、元のメニューを選択済みにする
  if (isChangeMode() && AppState.changeModeData.oldMenu) {
    applySelectedMenuValue(AppState.changeModeData.oldMenu);
    updateMenuTotalDisplay();
  }
}

/**
 * 現在選択されているメニューの、合計金額・合計施術時間を計算して表示する
 * 「選んだメニューの合計金額と合計施術時間を表示する」設定がONの時だけ動く
 */
function updateMenuTotalDisplay() {
  if (!menuTotalDisplayEl || !CONFIG.SHOW_MENU_TOTAL) return;

  const selectedValue = getSelectedMenusValue();
  const menuNames = selectedValue ? selectedValue.split(',').map(m => m.trim()).filter(m => m) : [];

  if (menuNames.length === 0) {
    menuTotalDisplayEl.style.display = 'none';
    return;
  }

  const menuMaster = CONFIG.MENU_MASTER || {};
  let totalMinutes = 0;
  let totalPrice = 0;
  let hasApproxMinutes = false;
  let hasApproxPrice = false;

  menuNames.forEach(name => {
    const data = menuMaster[name];
    if (!data) return;
    totalMinutes += Number(data.minutes) || 0;
    totalPrice += Number(data.price) || 0;
    if (data.minutesApprox) hasApproxMinutes = true;
    if (data.priceApprox) hasApproxPrice = true;
  });

  const parts = [];
  if (totalMinutes > 0) parts.push(`${t('total_minutes_prefix')}${totalMinutes}${t('unit_minutes')}${hasApproxMinutes ? t('approx_suffix') : ""}`);
  parts.push(`${t('total_price_prefix')}${totalPrice.toLocaleString()}${hasApproxPrice ? t('approx_suffix') : ""}`);

  menuTotalDisplayEl.textContent = parts.join(" / ");
  menuTotalDisplayEl.style.display = 'block';
}

/**
 * メニュー選択欄がプルダウン形式（TYPE_A）かどうかを判定する
 * @returns {boolean} プルダウン形式なら true
 */
function isMenuPulldownType() {
  return CONFIG.MENU_SELECTOR_TYPE === 'TYPE_A';
}

/**
 * 現在選択されているメニューを取得する
 * @returns {string} メニュー名（複数選択時はカンマ区切り）
 */
function getSelectedMenusValue() {
  if (isMenuPulldownType()) {
    const menuSelect = document.getElementById('menu-select');
    return menuSelect ? menuSelect.value : '';
  }

  const checkboxes = document.querySelectorAll('.menu-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.value).join(',');
}

/**
 * 指定されたメニューを選択済み状態にする
 * @param {string} menuValue - メニュー名（カンマ区切り可）
 */
function applySelectedMenuValue(menuValue) {
  if (!menuValue) return;

  if (isMenuPulldownType()) {
    const menuSelect = document.getElementById('menu-select');
    if (menuSelect) menuSelect.value = menuValue;
    return;
  }

  const oldMenus = String(menuValue).split(',');
  document.querySelectorAll('.menu-checkbox').forEach(cb => {
    cb.checked = oldMenus.includes(cb.value);
  });
}

/**
 * メニューの選択状態をすべて解除する
 */
function clearSelectedMenuValue() {
  if (isMenuPulldownType()) {
    const menuSelect = document.getElementById('menu-select');
    if (menuSelect) menuSelect.selectedIndex = 0;
    return;
  }

  document.querySelectorAll('.menu-checkbox').forEach(cb => {
    cb.checked = false;
  });
}

// -----------------------------------------------------------------
// 5. セクション切替・タイムテーブル（時間表）描画
// -----------------------------------------------------------------

// 現在タイムテーブルに表示中の開始日と、その表示日数（ページ送りボタンで使用）
let currentTimetableStartDate = '';
let currentTimetableDayCount = 0;

/**
 * 指定したセクションだけを表示する
 * @param {HTMLElement} targetContainer - 表示したいセクション
 */
function showSection(targetContainer) {
  const sections = [step1Container, step2Container, step3Container, checkTabContainer, pageFragmentContainer];
  sections.forEach(sec => {
    if (sec) sec.style.display = 'none';
  });

  if (targetContainer) targetContainer.style.display = 'block';

  updateStepIndicator(targetContainer);
}

/**
 * 表示中のステップに応じて、上部の進捗表示（①②③）を更新する
 * 予約確認・キャンセル画面（checkTabContainer）の時は、この進捗表示自体を非表示にする
 * @param {HTMLElement} targetContainer - 今から表示するセクション
 */
function updateStepIndicator(targetContainer) {
  if (!stepIndicator) return;

  let currentStep = 0;
  if (targetContainer === step1Container) currentStep = 1;
  else if (targetContainer === step2Container) currentStep = 2;
  else if (targetContainer === step3Container) currentStep = 3;

  if (currentStep === 0) {
    stepIndicator.style.display = 'none';
    return;
  }
  stepIndicator.style.display = 'flex';

  stepIndicator.querySelectorAll('.step-item').forEach(item => {
    const stepNum = parseInt(item.getAttribute('data-step'), 10);
    item.classList.remove('active', 'completed');
    if (stepNum === currentStep) {
      item.classList.add('active');
    } else if (stepNum < currentStep) {
      item.classList.add('completed');
    }
  });

  stepIndicator.querySelectorAll('.step-line').forEach((line, idx) => {
    const lineStepNum = idx + 1; // この線は data-step (idx+1) と (idx+2) の間にある
    line.classList.toggle('completed', lineStepNum < currentStep);
  });
}

/**
 * タイムテーブル領域にメッセージだけを表示する
 * @param {string} message - 表示する文言
 * @param {boolean} [isError] - エラー表示にするか
 */
function renderTimetableMessage(message, isError = false) {
  if (!timetableContainer) return;
  const cls = isError ? 'no-data text-danger' : 'no-data';
  timetableContainer.innerHTML = `<div class="${cls}">${escapeHtml(message)}</div>`;
}

/**
 * 複数日分の空き状況からタイムテーブルを描画する
 * @param {Object} multiDayStatuses - GASから取得した空き状況データ
 */
function renderTimetable(multiDayStatuses) {
  if (!timetableContainer) return;

  if (multiDayStatuses && multiDayStatuses.success === false) {
    renderTimetableMessage(`【エラー検知】${multiDayStatuses.message || ''}`, true);
    return;
  }

  if (!multiDayStatuses || Object.keys(multiDayStatuses).length === 0) {
    renderTimetableMessage('空き枠がありません。', true);
    return;
  }

  const dateKeys = Object.keys(multiDayStatuses).sort();
  let timeSlots = [];

  // 営業日のデータから、表示する時間の並びを取り出す
  for (const dKey of dateKeys) {
    const dayData = multiDayStatuses[dKey];
    if (dayData && !dayData.SHOP_HOLIDAY) {
      const slots = Object.keys(dayData).filter(key => /^\d{1,2}:\d{2}$/.test(key));
      if (slots.length > 0) {
        timeSlots = slots.sort((a, b) => {
          const [aHour, aMin] = a.split(':').map(Number);
          const [bHour, bMin] = b.split(':').map(Number);
          return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });
        break;
      }
    }
  }

  // 表示できる時間が1つも無い場合は、表を作らずに知らせる
  if (timeSlots.length === 0) {
    renderTimetableMessage('この期間に空き枠がありません。日付を変えてお試しください。');
    return;
  }

  let html = '<table class="timetable-table"><thead><tr><th>時間</th>';

  dateKeys.forEach(dStr => {
    const dayIndex = getDayOfWeekIndex(dStr);
    const dayClass = dayIndex === 6 ? ' class="day-sat"' : (dayIndex === 0 ? ' class="day-sun"' : '');
    html += `<th${dayClass}>${escapeHtml(formatDateHeaderLabel(dStr))}</th>`;
  });

  html += '</tr></thead><tbody>';

  timeSlots.forEach((timeStr, rowIndex) => {
    html += `<tr><td class="time-col">${escapeHtml(timeStr)}</td>`;

    dateKeys.forEach(dStr => {
      const dayData = multiDayStatuses[dStr];

      // 店舗休業日は、1列まるごと1つのセルにまとめて表示する
      if (dayData && dayData.SHOP_HOLIDAY) {
        if (rowIndex === 0) {
          const holidayText = dayData.HOLIDAY_TEXT || '休業日';
          html += `<td rowspan="${timeSlots.length}" class="shop-holiday-cell"><strong>${escapeHtml(holidayText)}</strong></td>`;
        }
        return;
      }

      const status = dayData ? dayData[timeStr] : '×';

      if (status === '○') {
        html += `<td class="slot-cell slot-available" data-date="${escapeHtml(dStr)}" data-time="${escapeHtml(timeStr)}">◎</td>`;
      } else if (status === '－') {
        // 満席ではなく「そもそも受付していない時間」（受付締切超過・営業時間外など）。キャンセル待ちの対象にはしない
        html += '<td class="slot-cell slot-closed"></td>';
      } else if (CONFIG.WAITLIST_ENABLED) {
        html += `<td class="slot-cell slot-unavailable slot-waitlist" data-date="${escapeHtml(dStr)}" data-time="${escapeHtml(timeStr)}" title="キャンセル待ちに登録する">△</td>`;
      } else {
        html += '<td class="slot-cell slot-unavailable">×</td>';
      }
    });

    html += '</tr>';
  });

  html += '</tbody></table>';
  timetableContainer.innerHTML = html;

  bindTimetableCellEvents();
}

/**
 * 空き枠セルのクリック処理を登録する
 */
function bindTimetableCellEvents() {
  document.querySelectorAll('.slot-available').forEach(cell => {
    cell.addEventListener('click', (e) => {
      document.querySelectorAll('.slot-available').forEach(c => c.classList.remove('selected'));

      const target = e.currentTarget;
      target.classList.add('selected');

      if (selectedDateInput) selectedDateInput.value = target.getAttribute('data-date');
      if (selectedTimeInput) selectedTimeInput.value = target.getAttribute('data-time');

      if (submitBtn) {
        submitBtn.disabled = false;
        if (isChangeMode()) {
          submitBtn.textContent = (getChangeProvisionalWordingMode() === 'PROVISIONAL')
            ? t('submit_btn_change_provisional')
            : t('submit_btn_change');
        } else {
          const mode = getProvisionalWordingMode();
          submitBtn.textContent = mode === 'PROVISIONAL'
            ? t('submit_btn_provisional')
            : (mode === 'NEUTRAL' ? t('submit_btn_neutral') : t('submit_btn_confirm'));
        }
      }
    });
  });

  document.querySelectorAll('.slot-waitlist').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const target = e.currentTarget;
      handleWaitlistCellClick(target.getAttribute('data-date'), target.getAttribute('data-time'));
    });
  });
}

/**
 * 満席（△）の枠がクリックされた時：入力済みの内容でキャンセル待ちに登録する
 * @param {string} dateStr
 * @param {string} timeStr
 */
async function handleWaitlistCellClick(dateStr, timeStr) {
  if (isChangeMode()) {
    alert(t('err_waitlist_during_change'));
    return;
  }

  if (!nameInput.value || !telInput.value || !getSelectedMenusValue()) {
    alert(t('err_waitlist_fill_info'));
    return;
  }

  const confirmMsg = t('waitlist_confirm_msg', { date: escapeHtml(dateStr), time: escapeHtml(timeStr) });
  const confirmed = await showCustomConfirm(confirmMsg);
  if (!confirmed) return;

  const payload = {
    date: dateStr,
    time: timeStr,
    staff: staffSelect.value,
    menu: getSelectedMenusValue(),
    name: nameInput.value,
    name_kana: nameKanaInput.value,
    tel: telInput.value,
    email: emailInput.value,
    memo: memoInput.value
  };

  try {
    const data = await submitReservationApi('registerWaitlist', payload);
    alert(data.message || (data.success ? t('waitlist_register_success') : t('waitlist_register_fail')));

    if (data.success) {
      saveCurrentCustomerDataToCache();
      resetReservationSelection();
      applyCachedCustomerDataToForm();
      showSection(step1Container);
    }
  } catch (error) {
    console.error('キャンセル待ち登録エラー:', error);
    alert(t('err_network'));
  }
}

/**
 * 選択条件をもとに空き状況を取得して描画する
 * @param {string} [dateOverride] - 指定時はこの日付を起点に取得する（ページ送り用。省略時は画面の日付欄を使う）
 * @returns {Promise<boolean>} 取得と描画に成功したら true
 */
async function updateAvailableTimes(dateOverride) {
  const dateVal = dateOverride || (dateInput ? dateInput.value : '');
  const staffVal = staffSelect ? staffSelect.value : '';
  const menuVal = getSelectedMenusValue();

  if (!dateVal || !staffVal || !menuVal) {
    alert(t('err_select_all_for_timetable'));
    return false;
  }

  if (timetableContainer) timetableContainer.innerHTML = '';
  if (timetableLoading) timetableLoading.style.display = 'block';

  try {
    const resId = isChangeMode() ? (AppState.changeModeData.resId || '') : '';
    const telVal = document.getElementById('tel') ? document.getElementById('tel').value : '';
    const multiDayStatuses = await fetchTimetableDataApi(dateVal, staffVal, menuVal, resId, telVal);

    if (multiDayStatuses && multiDayStatuses.success === false) {
      console.error('タイムテーブル取得失敗:', multiDayStatuses.message);
      renderTimetableMessage(`データの取得に失敗しました: ${multiDayStatuses.message || ''}`, true);
      return false;
    }

    // ページ送り（次/前の日程）で使うため、今回表示した開始日と日数を覚えておく
    currentTimetableStartDate = dateVal;
    currentTimetableDayCount = (multiDayStatuses && typeof multiDayStatuses === 'object')
      ? Object.keys(multiDayStatuses).length || CONFIG.DISPLAY_DAYS
      : CONFIG.DISPLAY_DAYS;

    renderTimetable(multiDayStatuses);
    updateTimetableNavButtons();

    if (selectedDateInput) selectedDateInput.value = '';
    if (selectedTimeInput) selectedTimeInput.value = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t('submit_btn_default');
    }
    return true;
  } catch (error) {
    console.error('空き状況更新エラー:', error);
    renderTimetableMessage(`通信エラーが発生しました: ${error.message || error}`, true);
    return false;
  } finally {
    if (timetableLoading) timetableLoading.style.display = 'none';
  }
}

/**
 * 「前の日程を見る」ボタンを、今日より前に戻れないよう無効化する
 */
function updateTimetableNavButtons() {
  if (!prevTimetableBtn) return;
  const todayStr = formatLocalDateInputValue(new Date());
  prevTimetableBtn.disabled = currentTimetableStartDate <= todayStr;
}

/**
 * 次の日程（表示中の続き）へページ送りする
 */
async function goToNextTimetablePage() {
  const dayCount = currentTimetableDayCount || CONFIG.DISPLAY_DAYS;
  const nextDate = addDaysToDateString(currentTimetableStartDate, dayCount);
  await updateAvailableTimes(nextDate);
}

/**
 * 前の日程へページ送りする（今日より前には戻らない）
 */
async function goToPrevTimetablePage() {
  const dayCount = currentTimetableDayCount || CONFIG.DISPLAY_DAYS;
  const prevDate = addDaysToDateString(currentTimetableStartDate, -dayCount);
  const todayStr = formatLocalDateInputValue(new Date());
  await updateAvailableTimes(prevDate < todayStr ? todayStr : prevDate);
}

// -----------------------------------------------------------------
// 6. フォーム送信処理
// -----------------------------------------------------------------
/**
 * 予約の新規登録・変更を送信する
 * @param {Event} e - submitイベント
 */
/**
 * 仮予約制度の設定と、今選ばれているメニューから、
 * お客様向けの文言をどのパターンにすべきか判定する
 * @returns {string} "PROVISIONAL"（仮予約の文言）/ "NEUTRAL"（中立的な文言）/ "NORMAL"（通常予約の文言）
 */
/**
 * 予約変更時、変更後の内容が「仮予約」になる見込みかどうかを判定する（表示文言の切り替え用）
 * バックエンド（Reservation.gs の _determineProvisionalStatus）と完全に同じ考え方：
 * ・「特定メニューのみ対象」の設定の時は、選んだメニューで判定する
 * ・「全員」「新規のみ」対象の設定は、メニューに関係なく、変更前の状態（確認待ちだったかどうか）がそのまま維持される
 * @returns {string} "PROVISIONAL"（仮予約になる文言）/ "NORMAL"（通常の変更文言）
 */
function getChangeProvisionalWordingMode() {
  if (!CONFIG.PROVISIONAL_RESERVATION_ENABLED) return 'NORMAL';

  if (CONFIG.PROVISIONAL_RESERVATION_TARGET === 'MENU_ONLY') {
    const selectedMenuVal = getSelectedMenusValue();
    const selectedMenuList = String(selectedMenuVal || '').split(',').map(m => m.trim());
    const qualifiesNow = selectedMenuList.some(m => (CONFIG.PROVISIONAL_RESERVATION_TARGET_MENUS || []).includes(m));
    return qualifiesNow ? 'PROVISIONAL' : 'NORMAL';
  }

  const wasPending = !!(AppState.changeModeData && AppState.changeModeData.oldProvisionalStatus === '確認待ち');
  return wasPending ? 'PROVISIONAL' : 'NORMAL';
}

function getProvisionalWordingMode() {
  if (!CONFIG.PROVISIONAL_RESERVATION_ENABLED) return 'NORMAL';

  if (CONFIG.PROVISIONAL_RESERVATION_TARGET === 'MENU_ONLY') {
    // メニュー限定の場合、選択されたメニューで正確に判定できる
    const selectedMenuVal = getSelectedMenusValue();
    const selectedMenuList = String(selectedMenuVal || '').split(',').map(m => m.trim());
    const isMatch = selectedMenuList.some(m => (CONFIG.PROVISIONAL_RESERVATION_TARGET_MENUS || []).includes(m));
    return isMatch ? 'PROVISIONAL' : 'NORMAL';
  }

  if (CONFIG.PROVISIONAL_RESERVATION_TARGET === 'NEW_ONLY') {
    // 新規のお客様だけ仮予約になる設定の場合、この時点では仮予約かどうか確定できないため中立的な文言にする
    return 'NEUTRAL';
  }

  return 'PROVISIONAL'; // "ALL"
}

/**
 * ブラウザ標準のconfirm()の代わりに、装飾できる確認ポップアップを表示する
 * @param {string} htmlMessage - 表示するメッセージ（HTMLタグの装飾も使える）
 * @returns {Promise<boolean>} 「はい」が押されたら true、「キャンセル」なら false
 */
function showCustomConfirm(htmlMessage) {
  return new Promise(resolve => {
    if (!customConfirmOverlay || !customConfirmMessage || !customConfirmOkBtn || !customConfirmCancelBtn) {
      resolve(confirm(htmlMessage.replace(/<[^>]+>/g, ''))); // ポップアップ要素がない場合の保険
      return;
    }

    customConfirmMessage.innerHTML = htmlMessage;
    customConfirmOverlay.style.display = 'flex';

    const cleanup = (result) => {
      customConfirmOverlay.style.display = 'none';
      customConfirmOkBtn.removeEventListener('click', onOk);
      customConfirmCancelBtn.removeEventListener('click', onCancel);
      resolve(result);
    };
    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);

    customConfirmOkBtn.addEventListener('click', onOk);
    customConfirmCancelBtn.addEventListener('click', onCancel);
  });
}

async function handleReservationSubmit(e) {
  e.preventDefault();

  const isChange = isChangeMode();

  const confirmMsg = isChange
    ? (getChangeProvisionalWordingMode() === 'PROVISIONAL' ? t('confirm_change_provisional') : t('confirm_change_reservation'))
    : (() => {
        const mode = getProvisionalWordingMode();
        if (mode === 'PROVISIONAL') return t('confirm_submit_provisional');
        if (mode === 'NEUTRAL') return t('confirm_submit_neutral');
        return t('confirm_submit_normal');
      })();

  const confirmed = await showCustomConfirm(confirmMsg);
  if (!confirmed) return;

  submitBtn.disabled = true;
  submitBtn.textContent = isChange ? t('submit_btn_sending_change') : t('submit_btn_sending_new');

  saveCurrentCustomerDataToCache();

  const action = isChange ? 'change' : 'create';
  const payload = {
    staff: staffSelect.value,
    menu: getSelectedMenusValue(),
    name: nameInput.value,
    name_kana: nameKanaInput.value,
    tel: telInput.value,
    email: emailInput.value,
    formData: memoInput.value
  };

  if (isChange) {
    payload.resId = AppState.changeModeData.resId;
    payload.newDate = selectedDateInput.value;
    payload.newTime = selectedTimeInput.value;
  } else {
    payload.date = selectedDateInput.value;
    payload.time = selectedTimeInput.value;
  }

  try {
    const data = await submitReservationApi(action, payload);

    if (!data.success) {
      alert(t('err_process_failed_prefix') + data.message);
      return;
    }

    if (isChange) {
      const isProvisional = !!data.isProvisional;
      alert(isProvisional ? t('change_success_provisional') : t('change_success'));
      AppState.changeModeData = null;
      renderChangeBanner(null);
    } else {
      const isProvisional = !!data.isProvisional;
      const baseMsg = isProvisional ? t('reservation_success_provisional') : t('reservation_success_normal');
      const msg = data.resId ? `${baseMsg}\n${t('reservation_id_suffix', { resId: data.resId })}` : baseMsg;
      alert(msg);
    }

    // 確認タブの入力欄にも今回の連絡先を反映しておく
    if (checkTelInput) checkTelInput.value = telInput.value;
    if (checkEmailInput) checkEmailInput.value = emailInput.value;

    resetReservationSelection();
    applyCachedCustomerDataToForm();
    await initializeSystemUI();

    if (isChange) {
      showSection(checkTabContainer);
      await fetchReservations();
    } else {
      showSection(step1Container);
    }
  } catch (error) {
    console.error('送信エラー:', error);
    alert(t('err_network_short'));
  } finally {
    submitBtn.disabled = false;
  }
}

// -----------------------------------------------------------------
// 7. イベントリスナー設定
// -----------------------------------------------------------------
/**
 * 画面上のすべてのイベントを登録する
 */
function initializeEvents() {
  if (form) {
    form.addEventListener('submit', handleReservationSubmit);
  }

  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      if (!nameInput.checkValidity() || !nameKanaInput.checkValidity() || !telInput.checkValidity() || !emailInput.checkValidity()) {
        alert(t('err_fill_customer_info'));
        return;
      }
      showSection(step2Container);
    });
  }

  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', async () => {
      if (!dateInput.value || !staffSelect.value || !getSelectedMenusValue()) {
        alert(t('err_select_date_staff_menu'));
        return;
      }

      const originalText = toStep3Btn.textContent;
      toStep3Btn.disabled = true;
      toStep3Btn.textContent = t('loading_slots');

      const success = await updateAvailableTimes();

      toStep3Btn.disabled = false;
      toStep3Btn.textContent = originalText;

      if (success) {
        showSection(step3Container);
      }
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => showSection(step1Container));
  }

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => showSection(step2Container));
  }

  const goToCheckHandler = () => {
    applyCachedCustomerDataToForm();
    showSection(checkTabContainer);
  };

  if (goToCheckBtn) {
    goToCheckBtn.addEventListener('click', goToCheckHandler);
  }

  if (goToCheckBtnStep2) {
    goToCheckBtnStep2.addEventListener('click', goToCheckHandler);
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (CONFIG.HOME_PAGE_URL) {
        window.location.href = CONFIG.HOME_PAGE_URL;
      }
    });
  }

  if (backToReservationBtn) {
    backToReservationBtn.addEventListener('click', () => showSection(step1Container));
  }

  if (backFromCheckBtn) {
    backFromCheckBtn.addEventListener('click', () => showSection(step1Container));
  }

  if (checkBtn) {
    checkBtn.addEventListener('click', fetchReservations);
  }

  document.querySelectorAll('.mypage-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.mypage-tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      document.querySelectorAll('.mypage-tab-panel').forEach(panel => {
        panel.style.display = 'none';
      });

      const target = document.getElementById(tabBtn.getAttribute('data-target'));
      if (target) target.style.display = 'block';
    });
  });

  if (cancelChangeBtn) {
    cancelChangeBtn.addEventListener('click', abortChangeMode);
  }

  if (nextTimetableBtn) {
    nextTimetableBtn.addEventListener('click', async () => {
      nextTimetableBtn.disabled = true;
      await goToNextTimetablePage();
      nextTimetableBtn.disabled = false;
    });
  }

  if (prevTimetableBtn) {
    prevTimetableBtn.addEventListener('click', async () => {
      prevTimetableBtn.disabled = true;
      await goToPrevTimetablePage();
    });
  }

  if (resultsArea) {
    resultsArea.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('btn-change')) {
        startChangeMode(target);
      } else if (target.classList.contains('btn-cancel')) {
        requestCancel(target);
      }
    });
  }
}

// -----------------------------------------------------------------
// 8. ページ読み込み時の自動実行
// -----------------------------------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  initializeEvents();
  applyCachedCustomerDataToForm();
  showSection(step1Container);
  await initializeSystemUI();

  // フッターのコピーライトリンク（config.jsの値をそのまま反映。GASの設定取得を待たない）
  const copyrightLink = document.getElementById('copyright-link');
  if (copyrightLink) {
    copyrightLink.textContent = CONFIG.COPYRIGHT_LINK_TEXT;
    copyrightLink.href = CONFIG.COPYRIGHT_LINK_URL;
  }

  // URLに ?waitlist=キャンセル待ちID が付いている場合
  // （キャンセル待ちの「空きが出ました」メール内のリンクから来た場合）、
  // その内容を自動で入力し、日時選択画面まで一気に進める
  const urlParams = new URLSearchParams(window.location.search);
  const waitlistId = urlParams.get('waitlist');
  if (waitlistId) {
    await applyWaitlistLinkIfPresent(waitlistId);
  }
});

/**
 * キャンセル待ちの「空きが出ました」メールのリンク（?waitlist=キャンセル待ちID）から来た場合、
 * その内容を取得して予約フォームに自動入力し、日時選択画面まで進める
 * @param {string} waitlistId
 */
async function applyWaitlistLinkIfPresent(waitlistId) {
  try {
    const result = await fetchWaitlistDetailsApi(waitlistId);
    if (!result.success) {
      alert(result.message || 'この空き案内の情報を取得できませんでした。お手数ですが、新規予約からお手続きください。');
      return;
    }
    await applyWaitlistDetailsToForm(result);
  } catch (error) {
    console.error('キャンセル待ちリンクの処理エラー:', error);
  }
}

/**
 * 取得したキャンセル待ちの内容を、予約フォーム（お客様情報・予約条件）へ反映し、
 * 日時選択画面まで進めて、対象の時間がまだ空いていれば自動で選択する
 * @param {Object} details - getWaitlistDetailsById の戻り値
 */
async function applyWaitlistDetailsToForm(details) {
  if (nameInput) nameInput.value = details.name || '';
  if (nameKanaInput) nameKanaInput.value = details.nameKana || '';
  if (telInput) telInput.value = details.tel || '';
  if (emailInput) emailInput.value = details.email || '';
  if (memoInput) memoInput.value = details.memo || '';

  if (dateInput) dateInput.value = details.date || '';
  if (staffSelect && details.staff) staffSelect.value = details.staff;
  if (details.menu) applySelectedMenuValue(details.menu);

  showSection(step2Container);

  if (!dateInput.value || !staffSelect.value || !getSelectedMenusValue()) {
    alert('空き枠の情報を自動入力しましたが、内容の反映に失敗した項目があります。お手数ですが、内容をご確認のうえお手続きください。');
    return;
  }

  const success = await updateAvailableTimes();
  if (!success) return;

  showSection(step3Container);

  // 対象の時間がまだ空いていれば（他のお客様に先を越されていなければ）、自動で選択する
  const dateSlash = (details.date || '').replace(/-/g, '/');
  const targetCell = timetableContainer
    ? timetableContainer.querySelector(`.slot-available[data-date="${dateSlash}"][data-time="${details.time}"]`)
    : null;

  if (targetCell) {
    targetCell.click();
  } else {
    alert('大変申し訳ございません、この枠は他のお客様が既にご予約済みの可能性があります。恐れ入りますが、表示されている他の空き時間からお選びください。');
  }
}
