/**
 * =================================================================
 * Salon Information System (SIS) - js/admin-pages.js [Version 2.0.0]
 * [役割: 管理画面「ページ編集」タブ（Informationカードの内容＋本文を、ページごとにまとめて編集）]
 * 読み込み順: admin-core.js・admin-settings.js の後に読み込むこと
 * （buildInfoSectionSettings・renderInfoItemRows・collectInfoItems はadmin-settings.js側の関数）
 * =================================================================
 */

const pageEditLoading = document.getElementById('page-edit-loading');
const pageEditError = document.getElementById('page-edit-error');
const pageEditSavedMsg = document.getElementById('page-edit-saved-msg');
const pageEditForm = document.getElementById('page-edit-form');
const savePageContentBtn = document.getElementById('save-page-content-btn');

let pageEditLoaded = false;
let pageContentsCache = {};

/**
 * 「ページ編集」タブを開いた時に、Informationカードの内容（レイアウトタブと共通）と、
 * 4ページ分の本文を、まとめて読み込む
 */
async function loadPageContents() {
  if (pageEditLoading) pageEditLoading.style.display = 'block';
  if (pageEditError) pageEditError.style.display = 'none';
  if (pageEditForm) pageEditForm.style.display = 'none';

  try {
    // Informationカードの内容（レイアウトタブがまだ開かれていない場合のみ、ここで読み込む）
    if (!settings3Loaded) {
      await loadSettings3();
    }

    // 4ページ分の本文
    const result = await callAdminApi('getPageContents');
    if (!result.success) throw new Error(result.message || 'ページ本文の取得に失敗しました。');

    pageContentsCache = result.pageContents || {};
    for (let i = 1; i <= 4; i++) {
      const editor = document.getElementById(`page-editor-${i}`);
      if (editor) editor.innerHTML = pageContentsCache[String(i)] || '';
    }

    pageEditLoaded = true;
    if (pageEditForm) pageEditForm.style.display = 'block';
  } catch (error) {
    console.error('ページ編集タブの読み込みエラー:', error);
    if (pageEditError) {
      pageEditError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      pageEditError.style.display = 'block';
    }
  } finally {
    if (pageEditLoading) pageEditLoading.style.display = 'none';
  }
}

// ページ切り替え（1ページ〜4ページ）：該当するパネルだけを表示する
document.querySelectorAll('.page-sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.page-sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const targetPage = btn.getAttribute('data-page-sub');
    document.querySelectorAll('.page-sub-panel').forEach(panel => {
      panel.style.display = (panel.getAttribute('data-page-sub-panel') === targetPage) ? 'block' : 'none';
    });
  });
});

// ツールバーのボタン（太字・斜体・見出し・箇条書き・リンク）。4パネル共通で同じ処理でよい
// （document.execCommandは、今カーソルがある＝フォーカスしている入力欄に対して効くため）
document.querySelectorAll('.page-editor-toolbar button[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.getAttribute('data-cmd');

    if (cmd === 'createLink') {
      const url = prompt('リンク先のURLを入力してください（例：https://example.com）');
      if (url) document.execCommand('createLink', false, url);
      return;
    }
    if (cmd === 'formatBlock') {
      document.execCommand('formatBlock', false, btn.getAttribute('data-value'));
      return;
    }
    document.execCommand(cmd, false, null);
  });
});

// 画像ボタン → 対応する（data-editor-targetで紐付いた）隠しファイル選択欄をクリックさせる
document.querySelectorAll('.page-edit-image-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-editor-target');
    const input = document.querySelector(`.page-edit-image-input[data-editor-target="${targetId}"]`);
    if (input) input.click();
  });
});

// 地図ボタン → Googleマップの「地図を埋め込む」機能でコピーした<iframe>コードを貼り付けてもらい、そのまま本文に挿入する
document.querySelectorAll('.page-edit-map-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-editor-target');
    const editor = document.getElementById(targetId);

    const iframeHtml = prompt(
      'Googleマップで地図を開き、「共有」→「地図を埋め込む」からコピーできる、<iframe...>で始まるコードをそのまま貼り付けてください。'
    );
    if (!iframeHtml) return;

    const trimmed = iframeHtml.trim();
    if (!/^<iframe[\s\S]*<\/iframe>$/i.test(trimmed)) {
      alert('<iframe>から始まる、Googleマップの埋め込みコードを貼り付けてください。');
      return;
    }

    if (editor) editor.focus();
    document.execCommand('insertHTML', false, trimmed);
  });
});

// 画像が選択されたら、Googleドライブへアップロードし、対応する本文欄のカーソル位置に挿入する
document.querySelectorAll('.page-edit-image-input').forEach(input => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    const targetId = input.getAttribute('data-editor-target');
    const editor = document.getElementById(targetId);
    const btn = document.querySelector(`.page-edit-image-btn[data-editor-target="${targetId}"]`);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'アップロード中...';
      }

      try {
        const result = await callAdminApi('uploadPageImage', {
          imageData: base64Data,
          mimeType: file.type,
          fileName: file.name
        });

        if (!result.success) throw new Error(result.message || '画像のアップロードに失敗しました。');

        if (editor) editor.focus();
        document.execCommand('insertImage', false, result.url);
      } catch (error) {
        console.error('画像アップロードエラー:', error);
        alert(error.message || '通信エラーが発生しました。時間をおいて再度お試しください。');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = '🖼️画像';
        }
        input.value = '';
      }
    };
    reader.readAsDataURL(file);
  });
});

// 保存：Informationカードの内容（INFO_SECTION）＋4ページ分の本文（PAGE_CONTENTS）をまとめて保存する
if (pageEditForm) {
  pageEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (pageEditError) pageEditError.style.display = 'none';
    if (pageEditSavedMsg) pageEditSavedMsg.style.display = 'none';

    if (savePageContentBtn) {
      savePageContentBtn.disabled = true;
      savePageContentBtn.textContent = '保存中...';
    }

    try {
      const pageContents = {};
      for (let i = 1; i <= 4; i++) {
        const editor = document.getElementById(`page-editor-${i}`);
        pageContents[String(i)] = editor ? editor.innerHTML : '';
      }

      const settings = {
        INFO_SECTION: buildInfoSectionSettings(),
        PAGE_CONTENTS: pageContents
      };

      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      pageContentsCache = pageContents;
      if (pageEditSavedMsg) pageEditSavedMsg.style.display = 'block';
    } catch (error) {
      console.error('ページ編集タブの保存エラー:', error);
      if (pageEditError) {
        pageEditError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
        pageEditError.style.display = 'block';
      }
    } finally {
      if (savePageContentBtn) {
        savePageContentBtn.disabled = false;
        savePageContentBtn.textContent = '保存する';
      }
    }
  });
}
