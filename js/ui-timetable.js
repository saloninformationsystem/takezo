/**
 * =================================================================
 * Salon Information System (SIS) - js/ui-timetable.js [Version 1.0.0]
 * [役割: 空き状況タイムテーブルの表示・ページ送り・キャンセル待ちセルのクリック]
 * 読み込み順: ui-core.js の後に読み込むこと（timetableContainer等のDOM参照、
 * CONFIG・currentLang・t() などをui-core.js側から引き継いで使うため）
 * =================================================================
 */

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
