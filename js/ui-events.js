/**
 * =================================================================
 * Salon Information System (SIS) - js/ui-events.js [Version 1.0.0]
 * [役割: 予約送信処理、全イベントリスナーの初期化、キャンセル待ちリンクからの自動入力]
 * 読み込み順: ui-timetable.js の後、一番最後に読み込むこと
 * （ページ読み込み時のDOMContentLoadedイベント登録がこのファイルにあるため）
 * =================================================================
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
