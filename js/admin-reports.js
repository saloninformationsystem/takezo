/**
 * =================================================================
 * Salon Information System (SIS) - js/admin-reports.js [Version 1.0.0]
 * [役割: 管理画面「レポート」タブの集計取得・描画]
 * 読み込み順: admin-core.js の後に読み込むこと
 * =================================================================
 */

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

if (runReportBtn) {
  runReportBtn.addEventListener('click', runReport);
}

/**
 * 「アカウント管理」タブの現在値（登録済みアカウント一覧）を取得し、表示する
 */
/**
 * アカウント一覧を表として描画する（自分自身の行には削除ボタンを出さない）
 * @param {Array<Object>} accounts - { loginId, displayName } の配列
 */
/**
 * アカウント削除ボタンが押された時の処理（確認ダイアログを挟んでから実行する）
 * @param {string} targetLoginId
 */
