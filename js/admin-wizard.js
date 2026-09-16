/**
 * =================================================================
 * Salon Information System (SIS) - js/admin-wizard.js [Version 1.0.0]
 * [役割: 初回セットアップウィザード（管理画面のフロント側一式）]
 * 読み込み順: admin-core.js・admin-settings.js の後に読み込むこと
 * （callAdminApi・buildTimeSelectHtml・getTimeFromSelects はadmin-core.js/admin-settings.js側の関数）
 * =================================================================
 */

const wizardOverlay = document.getElementById('wizard-overlay');
const wizardError = document.getElementById('wizard-error');
const openWizardBtn = document.getElementById('open-wizard-btn');

let wizardCurrentStep = 1;

/**
 * 「次にやるとよいこと」の案内カード一覧（STEP5で表示するだけ。ここでは設定させない）
 */
const WIZARD_NEXT_STEPS = [
  { title: '仮予約制度', text: '予約が入ったら、店舗側で承認してから確定する運用にできます（「メニュー」タブ）' },
  { title: 'キャンセル待ち', text: '満席の枠に、お客様がキャンセル待ち登録できるようにします（「メニュー」タブ）' },
  { title: '多言語対応', text: '英語・韓国語・中国語・フランス語で表示できます（各タブの🌐翻訳ボタン）' },
  { title: 'テーマ', text: '予約サイト全体の色合い・雰囲気を切り替えられます（「レイアウト」タブ）' },
  { title: 'メール文面', text: '予約確定メール・お礼メールなどの文面を編集できます（「メール」タブ）' },
  { title: 'ページ編集', text: 'トップページ下の「Information」カードの内容を編集できます（「ページ編集」タブ）' }
];

let isDemoModeActive = false;

/**
 * ログイン直後に呼ばれる。スタッフ・メニューが1件も登録されていなければ、自動でウィザードを開く
 * デモモードの場合は、離脱時（画面を閉じる・タブを移動する等）に自動でデータをリセットする準備もする
 */
async function checkAndShowSetupWizard() {
  try {
    const result = await callAdminApi('checkSetupWizardStatus');

    isDemoModeActive = !!result.demoMode;
    if (isDemoModeActive) _setupDemoModeAutoReset();

    if (result.success && result.needsSetup) {
      openSetupWizard();
    }
  } catch (error) {
    console.error('セットアップウィザードの判定エラー:', error);
  }
}

/**
 * 内部ヘルパー: デモモード時のみ、画面を離れる瞬間にリセットを試みる仕組みを1回だけ登録する
 * sendBeaconは「ページを離れる瞬間でも、できる限り送信を試みる」ためのブラウザ標準の仕組み
 * （確実性を高めるため、時間主導型トリガーによる自動リセットもバックエンド側に用意している）
 */
let _demoResetListenerAttached = false;
function _setupDemoModeAutoReset() {
  if (_demoResetListenerAttached) return;
  _demoResetListenerAttached = true;

  const sendResetBeacon = () => {
    try {
      const body = new Blob([JSON.stringify({ action: 'resetDemoData' })], { type: 'text/plain' });
      navigator.sendBeacon(CONFIG.GAS_WEB_APP_URL, body);
    } catch (e) {
      // 送信に失敗しても、時間主導型トリガー側でいずれリセットされるので致命的ではない
    }
  };

  window.addEventListener('pagehide', sendResetBeacon);
  window.addEventListener('beforeunload', sendResetBeacon);
}

/**
 * ウィザードを開く（STEP1から）
 */
function openSetupWizard() {
  wizardCurrentStep = 1;
  showWizardStep(1);
  if (wizardOverlay) wizardOverlay.style.display = 'flex';

  // STEP2の時刻プルダウンを準備しておく
  const timeRow = document.getElementById('wizard-time-row');
  if (timeRow && !timeRow.dataset.built) {
    timeRow.innerHTML =
      buildTimeSelectHtml('wizard-open-select', '', false) +
      ' <span class="time-sep">〜</span> ' +
      buildTimeSelectHtml('wizard-close-select', '', false);
    timeRow.dataset.built = '1';
  }

  // STEP3の最初の1行、STEP4の最初の1行をまだ用意していなければ用意する
  const staffRows = document.getElementById('wizard-staff-rows');
  if (staffRows && staffRows.children.length === 0) addWizardStaffRow();

  const menuRows = document.getElementById('wizard-menu-rows');
  if (menuRows && menuRows.children.length === 0) addWizardMenuRow();
}

if (openWizardBtn) {
  openWizardBtn.addEventListener('click', openSetupWizard);
}

/**
 * 指定したSTEP番号の画面だけを表示し、進捗表示（丸数字）も更新する
 * @param {number} stepNum
 */
function showWizardStep(stepNum) {
  wizardCurrentStep = stepNum;
  if (wizardError) wizardError.style.display = 'none';

  document.querySelectorAll('.wizard-panel').forEach(panel => {
    panel.style.display = (parseInt(panel.getAttribute('data-wizard-panel'), 10) === stepNum) ? 'block' : 'none';
  });

  document.querySelectorAll('.wizard-step-item').forEach(item => {
    const itemStep = parseInt(item.getAttribute('data-wizard-step'), 10);
    item.classList.toggle('active', itemStep === stepNum);
    item.classList.toggle('completed', itemStep < stepNum);
  });
}

/**
 * ウィザード画面にエラーメッセージを表示する
 * @param {string} message
 */
function showWizardError(message) {
  if (!wizardError) return;
  wizardError.textContent = message || '通信エラーが発生しました。時間をおいて再度お試しください。';
  wizardError.style.display = 'block';
}

/**
 * 内部ヘルパー: ボタンを押している間、連打を防ぐために無効化＋文言変更する
 */
function _setWizardBtnBusy(btn, busyText) {
  if (!btn) return () => {};
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = busyText;
  return () => {
    btn.disabled = false;
    btn.textContent = original;
  };
}

/* =========================================================
   STEP1：店舗名
   ========================================================= */

const wizardStep1NextBtn = document.getElementById('wizard-step1-next');
if (wizardStep1NextBtn) {
  wizardStep1NextBtn.addEventListener('click', async () => {
    const salonName = document.getElementById('wizard-salon-name').value.trim();
    if (!salonName) { showWizardError('店舗名を入力してください。'); return; }

    const restore = _setWizardBtnBusy(wizardStep1NextBtn, '保存中...');
    try {
      const result = await callAdminApi('saveWizardStep1', { salonName: salonName });
      if (!result.success) throw new Error(result.message || '保存に失敗しました。');
      showWizardStep(2);
    } catch (error) {
      console.error('ウィザードSTEP1エラー:', error);
      showWizardError(error.message);
    } finally {
      restore();
    }
  });
}

/* =========================================================
   STEP2：営業時間・定休日
   ========================================================= */

const wizardStep2BackBtn = document.getElementById('wizard-step2-back');
const wizardStep2NextBtn = document.getElementById('wizard-step2-next');
const wizardAddNthWeekdayBtn = document.getElementById('wizard-add-nth-weekday-btn');
const wizardAddDateRangeBtn = document.getElementById('wizard-add-date-range-btn');

const WIZARD_WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 「第○曜日」の定休日を1行追加する（毎週の定休日とは別の、変則的な休みのため）
 */
function addWizardNthWeekdayRow() {
  const container = document.getElementById('wizard-nth-weekday-rows');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'wizard-staff-row';
  row.innerHTML = `
    <span>第</span>
    <select class="wizard-nth-select">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
    <select class="wizard-nth-weekday-select">
      ${WIZARD_WEEKDAY_LABELS.map((label, i) => `<option value="${i}">${label}曜日</option>`).join('')}
    </select>
    <span>を休みにする</span>
    <button type="button" class="btn-remove-row" title="削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

/**
 * 「年末年始・夏季休暇」など、期間指定の休暇を1行追加する
 */
function addWizardDateRangeRow() {
  const container = document.getElementById('wizard-date-range-rows');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'wizard-staff-row';
  row.innerHTML = `
    <input type="text" class="wizard-date-range-label-input" placeholder="例：年末年始休業">
    <input type="date" class="wizard-date-range-start-input">
    <span>〜</span>
    <input type="date" class="wizard-date-range-end-input">
    <button type="button" class="btn-remove-row" title="削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

if (wizardAddNthWeekdayBtn) wizardAddNthWeekdayBtn.addEventListener('click', addWizardNthWeekdayRow);
if (wizardAddDateRangeBtn) wizardAddDateRangeBtn.addEventListener('click', addWizardDateRangeRow);

if (wizardStep2BackBtn) wizardStep2BackBtn.addEventListener('click', () => showWizardStep(1));

if (wizardStep2NextBtn) {
  wizardStep2NextBtn.addEventListener('click', async () => {
    const timeRow = document.getElementById('wizard-time-row');
    const openTime = getTimeFromSelects(timeRow, 'wizard-open-select');
    const closeTime = getTimeFromSelects(timeRow, 'wizard-close-select');
    if (!openTime || !closeTime) { showWizardError('開店時刻・閉店時刻を選択してください。'); return; }

    const closedWeekdays = Array.from(document.querySelectorAll('.wizard-weekday-check:checked')).map(c => parseInt(c.value, 10));

    const nthWeekdayClosures = Array.from(document.querySelectorAll('#wizard-nth-weekday-rows .wizard-staff-row')).map(row => ({
      nth: parseInt(row.querySelector('.wizard-nth-select').value, 10),
      weekday: parseInt(row.querySelector('.wizard-nth-weekday-select').value, 10)
    }));

    const dateRangeClosures = Array.from(document.querySelectorAll('#wizard-date-range-rows .wizard-staff-row'))
      .map(row => ({
        label: row.querySelector('.wizard-date-range-label-input').value.trim(),
        startDate: row.querySelector('.wizard-date-range-start-input').value,
        endDate: row.querySelector('.wizard-date-range-end-input').value
      }))
      .filter(range => range.startDate && range.endDate);

    const restore = _setWizardBtnBusy(wizardStep2NextBtn, '作成中...（定休日カレンダーを準備しています）');
    try {
      const result = await callAdminApi('saveWizardStep2', {
        openTime: openTime,
        closeTime: closeTime,
        closedWeekdays: closedWeekdays,
        nthWeekdayClosures: nthWeekdayClosures,
        dateRangeClosures: dateRangeClosures
      });
      if (!result.success) throw new Error(result.message || '保存に失敗しました。');
      showWizardStep(3);
    } catch (error) {
      console.error('ウィザードSTEP2エラー:', error);
      showWizardError(error.message);
    } finally {
      restore();
    }
  });
}

/* =========================================================
   STEP3：スタッフ
   ========================================================= */

const wizardAddStaffBtn = document.getElementById('wizard-add-staff-btn');
const wizardStep3BackBtn = document.getElementById('wizard-step3-back');
const wizardStep3NextBtn = document.getElementById('wizard-step3-next');

function addWizardStaffRow() {
  const container = document.getElementById('wizard-staff-rows');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'wizard-staff-row';
  row.innerHTML = `
    <input type="text" class="wizard-staff-name-input" placeholder="店名 もしくは氏名">
    <button type="button" class="btn-remove-row" title="削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

if (wizardAddStaffBtn) wizardAddStaffBtn.addEventListener('click', addWizardStaffRow);

document.querySelectorAll('input[name="wizard-staff-mode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const isSolo = document.querySelector('input[name="wizard-staff-mode"]:checked').value === 'solo';
    if (wizardAddStaffBtn) wizardAddStaffBtn.style.display = isSolo ? 'none' : 'inline-block';

    // 1人モードに切り替えた場合は、2行目以降を削除して1行だけにする
    if (isSolo) {
      const container = document.getElementById('wizard-staff-rows');
      if (container) {
        Array.from(container.children).forEach((row, idx) => { if (idx > 0) row.remove(); });
      }
    }
  });
});

if (wizardStep3BackBtn) wizardStep3BackBtn.addEventListener('click', () => showWizardStep(2));

if (wizardStep3NextBtn) {
  wizardStep3NextBtn.addEventListener('click', async () => {
    const isSolo = document.querySelector('input[name="wizard-staff-mode"]:checked').value === 'solo';
    const staffList = Array.from(document.querySelectorAll('.wizard-staff-name-input'))
      .map(input => ({ name: input.value.trim() }))
      .filter(s => s.name);

    if (staffList.length === 0) { showWizardError('スタッフの名前を1人以上入力してください。'); return; }

    const restore = _setWizardBtnBusy(wizardStep3NextBtn, '作成中...（カレンダーを準備しています）');
    try {
      const result = await callAdminApi('saveWizardStep3', { staffList: staffList, isSolo: isSolo });
      if (!result.success) throw new Error(result.message || '保存に失敗しました。');
      showWizardStep(4);
    } catch (error) {
      console.error('ウィザードSTEP3エラー:', error);
      showWizardError(error.message);
    } finally {
      restore();
    }
  });
}

/* =========================================================
   STEP4：メニュー
   ========================================================= */

const wizardAddMenuBtn = document.getElementById('wizard-add-menu-btn');
const wizardStep4BackBtn = document.getElementById('wizard-step4-back');
const wizardStep4NextBtn = document.getElementById('wizard-step4-next');

function _wizardMenuNamePlaceholder() {
  const type = document.querySelector('input[name="wizard-menu-type"]:checked').value;
  return (type === 'TYPE_A') ? '例：カット＆カラー' : '例：カット';
}

function addWizardMenuRow() {
  const container = document.getElementById('wizard-menu-rows');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'wizard-menu-row';
  row.innerHTML = `
    <input type="text" class="wizard-menu-name-input" placeholder="${_wizardMenuNamePlaceholder()}">
    <input type="number" class="wizard-menu-minutes-input" min="5" step="5" placeholder="施術時間（分）">
    <input type="number" class="wizard-menu-price-input" min="0" placeholder="金額（任意）">
    <button type="button" class="btn-remove-row" title="削除">×</button>
  `;
  row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

if (wizardAddMenuBtn) wizardAddMenuBtn.addEventListener('click', addWizardMenuRow);

document.querySelectorAll('input[name="wizard-menu-type"]').forEach(radio => {
  radio.addEventListener('change', () => {
    // 選び方が切り替わったら、まだ何も入力されていないメニュー名欄のプレースホルダーだけ更新する
    const placeholder = _wizardMenuNamePlaceholder();
    document.querySelectorAll('.wizard-menu-name-input').forEach(input => {
      if (!input.value.trim()) input.placeholder = placeholder;
    });
  });
});

if (wizardStep4BackBtn) wizardStep4BackBtn.addEventListener('click', () => showWizardStep(3));

if (wizardStep4NextBtn) {
  wizardStep4NextBtn.addEventListener('click', async () => {
    const selectorType = document.querySelector('input[name="wizard-menu-type"]:checked').value;
    const menuList = Array.from(document.querySelectorAll('.wizard-menu-row')).map(row => {
      const priceVal = row.querySelector('.wizard-menu-price-input').value;
      return {
        name: row.querySelector('.wizard-menu-name-input').value.trim(),
        minutes: parseInt(row.querySelector('.wizard-menu-minutes-input').value, 10),
        price: priceVal === '' ? null : parseInt(priceVal, 10)
      };
    }).filter(m => m.name && !isNaN(m.minutes) && m.minutes > 0);

    if (menuList.length === 0) { showWizardError('メニュー名・施術時間を、1つ以上入力してください。'); return; }

    const restore = _setWizardBtnBusy(wizardStep4NextBtn, '保存中...');
    try {
      const result = await callAdminApi('saveWizardStep4', { selectorType: selectorType, menuList: menuList });
      if (!result.success) throw new Error(result.message || '保存に失敗しました。');
      prepareWizardStep5();
      showWizardStep(5);
    } catch (error) {
      console.error('ウィザードSTEP4エラー:', error);
      showWizardError(error.message);
    } finally {
      restore();
    }
  });
}

/* =========================================================
   STEP5：完了・道案内
   ========================================================= */

function prepareWizardStep5() {
  const urlInput = document.getElementById('wizard-site-url');
  if (urlInput) urlInput.value = window.location.href.replace(/admin\.html.*$/i, 'index.html');

  const cardsContainer = document.getElementById('wizard-next-cards');
  if (cardsContainer && cardsContainer.children.length === 0) {
    cardsContainer.innerHTML = WIZARD_NEXT_STEPS.map(step => `
      <div class="wizard-next-card">
        <div class="wizard-next-card-title">${step.title}</div>
        <div class="wizard-next-card-text">${step.text}</div>
      </div>
    `).join('');
  }
}

const wizardFinishBtn = document.getElementById('wizard-finish-btn');
if (wizardFinishBtn) {
  wizardFinishBtn.addEventListener('click', () => {
    if (wizardOverlay) wizardOverlay.style.display = 'none';

    // ウィザードで登録した内容が、各タブを開いた時に正しく反映されるよう、読み込み済みフラグをリセットする
    settings1Loaded = false;
    settings4Loaded = false;
    settings5Loaded = false;
    settings6Loaded = false;
  });
}
