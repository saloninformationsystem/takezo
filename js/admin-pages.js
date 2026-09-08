/**
 * =================================================================
 * Salon Information System (SIS) - js/admin-pages.js [Version 1.0.0]
 * [役割: 管理画面「ページ編集」タブ（4つの紹介ページの本文編集・画像アップロード）]
 * 読み込み順: admin-core.js の後に読み込むこと
 * =================================================================
 */

const pageEditLoading = document.getElementById('page-edit-loading');
const pageEditError = document.getElementById('page-edit-error');
const pageEditSavedMsg = document.getElementById('page-edit-saved-msg');
const pageEditForm = document.getElementById('page-edit-form');
const pageEditPageSelect = document.getElementById('page-edit-page-select');
const pageEditor = document.getElementById('page-editor');
const pageEditImageBtn = document.getElementById('page-edit-image-btn');
const pageEditImageInput = document.getElementById('page-edit-image-input');
const savePageContentBtn = document.getElementById('save-page-content-btn');

let pageEditLoaded = false;
let pageContentsCache = {};

/**
 * 「ページ編集」タブを開いた時に、4ページ分の本文をまとめて読み込む
 */
async function loadPageContents() {
  if (pageEditLoading) pageEditLoading.style.display = 'block';
  if (pageEditError) pageEditError.style.display = 'none';
  if (pageEditForm) pageEditForm.style.display = 'none';

  try {
    const result = await callAdminApi('getPageContents');
    if (!result.success) throw new Error(result.message || 'ページ本文の取得に失敗しました。');

    pageContentsCache = result.pageContents || {};
    if (pageEditPageSelect) pageEditPageSelect.setAttribute('data-current', pageEditPageSelect.value || '1');
    _renderCurrentPageIntoEditor();

    pageEditLoaded = true;
    if (pageEditForm) pageEditForm.style.display = 'block';
  } catch (error) {
    console.error('ページ本文の取得エラー:', error);
    if (pageEditError) {
      pageEditError.textContent = error.message || '通信エラーが発生しました。時間をおいて再度お試しください。';
      pageEditError.style.display = 'block';
    }
  } finally {
    if (pageEditLoading) pageEditLoading.style.display = 'none';
  }
}

/**
 * 内部ヘルパー: 今選ばれているページ番号の本文を、編集欄に反映する
 */
function _renderCurrentPageIntoEditor() {
  if (!pageEditPageSelect || !pageEditor) return;
  const pageNum = pageEditPageSelect.value;
  pageEditor.innerHTML = pageContentsCache[pageNum] || '';
}

// ページ切り替え時：今表示していた内容を一旦記憶してから、選んだページの内容に切り替える
// （保存ボタンを押すまでは、切り替えても内容は失われない）
if (pageEditPageSelect) {
  pageEditPageSelect.addEventListener('change', () => {
    const prevPage = pageEditPageSelect.getAttribute('data-current');
    if (prevPage && pageEditor) pageContentsCache[prevPage] = pageEditor.innerHTML;

    _renderCurrentPageIntoEditor();
    pageEditPageSelect.setAttribute('data-current', pageEditPageSelect.value);
  });
}

// ツールバーのボタン（太字・斜体・見出し・箇条書き・リンク）
document.querySelectorAll('.page-editor-toolbar button[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (pageEditor) pageEditor.focus();
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

// 画像ボタン → 隠しファイル選択欄をクリックさせる
if (pageEditImageBtn && pageEditImageInput) {
  pageEditImageBtn.addEventListener('click', () => {
    pageEditImageInput.click();
  });
}

// 画像が選択されたら、Googleドライブへアップロードし、本文のカーソル位置に挿入する
if (pageEditImageInput) {
  pageEditImageInput.addEventListener('change', () => {
    const file = pageEditImageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;

      if (pageEditImageBtn) {
        pageEditImageBtn.disabled = true;
        pageEditImageBtn.textContent = 'アップロード中...';
      }

      try {
        const result = await callAdminApi('uploadPageImage', {
          imageData: base64Data,
          mimeType: file.type,
          fileName: file.name
        });

        if (!result.success) throw new Error(result.message || '画像のアップロードに失敗しました。');

        if (pageEditor) pageEditor.focus();
        document.execCommand('insertImage', false, result.url);
      } catch (error) {
        console.error('画像アップロードエラー:', error);
        alert(error.message || '通信エラーが発生しました。時間をおいて再度お試しください。');
      } finally {
        if (pageEditImageBtn) {
          pageEditImageBtn.disabled = false;
          pageEditImageBtn.textContent = '🖼️画像';
        }
        pageEditImageInput.value = '';
      }
    };
    reader.readAsDataURL(file);
  });
}

// 保存
if (pageEditForm) {
  pageEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (pageEditError) pageEditError.style.display = 'none';
    if (pageEditSavedMsg) pageEditSavedMsg.style.display = 'none';

    // 今表示中のページの内容も、保存前にキャッシュへ反映する
    const currentPage = pageEditPageSelect ? pageEditPageSelect.value : '1';
    if (pageEditor) pageContentsCache[currentPage] = pageEditor.innerHTML;

    if (savePageContentBtn) {
      savePageContentBtn.disabled = true;
      savePageContentBtn.textContent = '保存中...';
    }

    try {
      const settings = { PAGE_CONTENTS: pageContentsCache };
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
      const response = await fetch(CONFIG.GAS_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveSettings', settings: JSON.stringify(settings), token: token })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message || '保存に失敗しました。');

      if (pageEditSavedMsg) pageEditSavedMsg.style.display = 'block';
    } catch (error) {
      console.error('ページ本文の保存エラー:', error);
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
