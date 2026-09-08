/**
 * =================================================================
 * Salon Information System (SIS) - js/i18n.js [Version 1.0.0]
 * [役割: サイト表示文言の多言語対応（辞書・言語切替）]
 * =================================================================
 *
 * 【このファイルの役割（今回の多言語対応 ステップ1）】
 * ・予約サイトの「システム固定文言」（ボタン・ラベル・案内文・エラーメッセージなど）を
 *   6言語（日本語・英語・韓国語・簡体字中国語・繁体字中国語・フランス語）に翻訳する
 *
 * 【今回、まだ対象外のもの（今後のステップで対応）】
 * ・管理画面から入力する内容（メニュー名、お知らせ文、ヘッダー・フッター文言など）
 * ・自動送信メールの文面
 * ・GAS側（サーバー側）から返ってくるエラーメッセージ本文（例: 予約可否チェックの詳細理由など）
 *   → これらは今まで通り日本語のまま表示されます
 *
 * 【使い方】
 * ・HTML側：<span data-i18n="キー名">日本語の文言</span> と書いておくと、
 *   ページ読み込み時・言語切替時に、選ばれている言語の文言に自動で置き換わる
 * ・placeholder属性を翻訳したい場合：data-i18n-placeholder="キー名"
 * ・HTMLタグを含む文言（太字など）を翻訳したい場合：data-i18n-html="キー名"
 * ・JavaScript側：t('キー名') を呼ぶと、選ばれている言語の文言（文字列）を返す
 *   例: alert(t('err_network'));
 *   変数を埋め込みたい場合：t('waitlist_confirm_msg', { date: '2026-09-24', time: '10:00' })
 *   → 辞書側の文言に {date} {time} と書いておくと、そこに差し込まれる
 */

const I18N_STRINGS = {

  // ===============================================================
  // 日本語（基本言語）
  // ===============================================================
  ja: {
    // 言語切り替え
    lang_switcher_label: "言語 / Language",

    // 予約変更中バナー
    change_banner_status: "現在 <strong>【予約日時を変更中】</strong> です。",
    change_banner_prev_title: "【変更前の予約内容】",
    change_banner_label_datetime: "日時:",
    change_banner_label_menu: "メニュー:",
    change_banner_label_staff: "担当者:",
    change_banner_label_id: "予約ID:",
    change_banner_instruction: "新しい日時を選択して、一番下の「変更を確定する」ボタンを押してください。",
    change_banner_cancel_btn: "➔ 変更をやめる",

    // ステップ表示
    step_label_1: "お客様情報の入力",
    step_label_2: "予約条件の選択",
    step_label_3: "日時の選択・確定",

    // マイページ導線
    home_btn_fallback: "トップページに戻る",
    mypage_link: "➔ マイページ",
    mypage_note: "予約の確認と過去の予約履歴が見れます",

    // STEP1：お客様情報
    label_name: "お名前 (フルネーム) *",
    placeholder_name: "漢字",
    label_name_kana: "フリガナ (フルネーム) *",
    placeholder_name_kana: "カタカナ",
    label_tel: "電話番号 *",
    placeholder_tel: "09012345678",
    note_tel: "ハイフンはあってもなくても構いません",
    label_email: "メールアドレス *",
    placeholder_email: "example@gmail.com",
    note_email: "予約の確認・自動キャンセル時に使用します",
    label_memo: "ご要望・備考",
    placeholder_memo: "ご相談や、ご用件などがあればご記入ください",
    btn_to_step2: "次に進む (予約条件の選択へ)",

    // STEP2：予約条件
    label_date: "ご来店希望日 *",
    label_staff: "担当スタッフ *",
    staff_placeholder_option: "担当スタッフを選択してください",
    menu_select_placeholder: "メニューを選択してください",
    menu_loading: "メニューを読み込んでいます...",
    label_menu: "施術メニュー",
    label_menu_multi_note: " (複数選択可)",
    btn_back: "⬅ 戻る",
    btn_to_step3: "次に進む (空き日時の選択へ)",

    // STEP3：日時選択
    label_datetime_select: "ご来店希望日時を選択してください *",
    btn_prev_timetable: "⬅ 前の日程を見る",
    btn_next_timetable: "次の日程を見る ➔",
    timetable_loading: "空き状況をリアルタイムで読み込んでいます...",
    timetable_placeholder: "条件に沿った空き枠を表示しています。",
    submit_btn_default: "日時を選択してください",
    submit_btn_confirm: "上記の内容で予約を確定する",
    submit_btn_provisional: "上記の内容で仮予約を申請する",
    submit_btn_neutral: "上記の内容で予約を送信する",
    submit_btn_change: "上記の内容で変更を確定する",
    submit_btn_change_provisional: "上記の内容で変更し、仮予約として申請する",
    submit_btn_sending_new: "予約を登録中...",
    submit_btn_sending_change: "予約を変更中...",
    loading_slots: "空き状況を読み込み中...",

    // マイページ画面
    mypage_title: "ご予約の確認・キャンセル",
    label_check_tel: "ご登録の電話番号",
    label_check_email: "ご登録のメールアドレス",
    note_check: "ご予約時に入力した「電話番号」と「メールアドレス」で検索します。",
    btn_back_to_new: "⬅ 戻る（新規予約へ）",
    btn_check: "ご予約状況を確認する",
    btn_checking: "検索中...",
    tab_current: "現在の予約",
    tab_history: "過去の履歴",
    tab_waitlist: "キャンセル待ち",
    check_placeholder: "情報を入力して確認ボタンを押してください。",
    btn_back_to_form: "⬅ 予約フォームに戻る",

    // カスタム確認ポップアップ
    confirm_cancel_btn: "キャンセル",
    confirm_ok_btn: "はい",

    // バリデーション・エラーメッセージ
    err_fill_customer_info: "お客様情報を正しく入力してください。",
    err_select_date_staff_menu: "ご来店希望日、スタッフ、メニューを選択してください。",
    err_select_all_for_timetable: "日付、スタッフ、メニューをすべて選択してください。",
    err_fill_tel_email: "電話番号とメールアドレスの両方を入力してください。",
    err_network: "通信エラーが発生しました。時間をおいて再度お試しください。",
    err_network_short: "通信エラーが発生しました。",
    err_process_failed_prefix: "処理に失敗しました: ",
    err_page_load_failed: "ページの読み込みに失敗しました。時間をおいて再度お試しください。",
    page_loading: "読み込み中...",

    // 予約送信の確認・完了メッセージ
    confirm_change_reservation: "選択した新しい日時で予約を変更してもよろしいですか？",
    confirm_change_provisional: "選択した内容に変更すると、<span class=\"custom-confirm-highlight\">仮予約</span>になります。よろしいですか？",
    confirm_submit_provisional: "この内容で<span class=\"custom-confirm-highlight\">仮予約</span>を申請してもよろしいですか？",
    confirm_submit_neutral: "この内容で予約を送信してもよろしいですか？",
    confirm_submit_normal: "この内容で予約を確定してもよろしいですか？",
    change_success: "ご予約の変更が正常に完了しました！",
    change_success_provisional: "変更内容を仮予約として申請しました！",
    reservation_success_provisional: "ご予約を申請しました！",
    reservation_success_normal: "ご予約が完了しました！",
    reservation_id_suffix: "【ご予約ID: {resId}】",

    // キャンセル待ち
    err_waitlist_during_change: "予約の変更中は、キャンセル待ちにご登録いただけません。",
    err_waitlist_fill_info: "お名前・お電話番号・メニューを入力してから、キャンセル待ちにご登録ください。",
    waitlist_confirm_msg: "{date} {time}〜 は、ただいま満席です。<br>空きが出たら、メールでお知らせしましょうか？",
    waitlist_register_success: "キャンセル待ちの登録が完了しました。",
    waitlist_register_fail: "登録に失敗しました。",

    // キャンセル処理
    confirm_cancel_reservation: "ご予約（ID: {resId}）をキャンセルしてもよろしいですか？\n\n※この操作は取り消せません。",
    cancelling_in_progress: "予約のキャンセル処理を行っています...",
    cancel_success: "ご予約のキャンセルが正常に完了しました。",
    cancel_fail_prefix: "キャンセルに失敗しました: ",

    // 予約検索・履歴
    searching_reservations: "予約データを検索しています...",
    no_reservations: "現在、条件に一致する今日以降のご予約はありません。",
    search_error: "エラーが発生しました。時間を置いて再度お試しください。",
    results_title_current: "お客様のご予約状況",
    searching_history: "来店履歴を検索しています...",
    no_history: "過去のご来店履歴はありません。",
    results_title_history: "過去のご来店履歴",

    // 予約カード・履歴カードのラベル
    res_label_memo: "備考・メモ",
    res_label_date: "予約日",
    res_label_time: "予約時間",
    res_label_menu: "メニュー",
    res_label_staff: "担当",
    res_label_id: "予約ID",
    res_created_at_prefix: "⏱ 受付時間：",
    btn_change_reservation: "日時を変更する",
    btn_change_expired: "日時変更期間を過ぎています",
    btn_cancel_reservation: "この予約をキャンセルする",
    btn_cancel_expired: "キャンセル期限を過ぎています",
    history_label_date: "来店日",
    history_label_time: "時間",
    history_status_visited: "来店済み",
    history_status_cancelled: "キャンセル済み",

    searching_waitlist: "キャンセル待ちを検索しています...",
    no_waitlist: "現在、キャンセル待ちの登録はありません。",
    results_title_waitlist: "キャンセル待ちの登録状況",
    waitlist_label_date: "希望日",
    waitlist_label_time: "希望時間",
    waitlist_status_waiting: "待機中",
    waitlist_status_notifying: "案内中",
    waitlist_status_notified: "案内済み",

    // メニュー表示（分・料金の単位）
    unit_minutes: "分",
    approx_suffix: "～",
    total_minutes_prefix: "合計 ",
    total_price_prefix: "合計 ￥"
  },

  // ===============================================================
  // English
  // ===============================================================
  en: {
    lang_switcher_label: "Language / 言語",

    change_banner_status: "You are currently <strong>changing your reservation date/time</strong>.",
    change_banner_prev_title: "[Previous reservation details]",
    change_banner_label_datetime: "Date/Time:",
    change_banner_label_menu: "Menu:",
    change_banner_label_staff: "Staff:",
    change_banner_label_id: "Reservation ID:",
    change_banner_instruction: "Please select a new date/time, then press the \"Confirm Change\" button at the bottom.",
    change_banner_cancel_btn: "➔ Cancel change",

    step_label_1: "Your information",
    step_label_2: "Reservation details",
    step_label_3: "Select date & time",

    home_btn_fallback: "Back to top page",
    mypage_link: "➔ My Page",
    mypage_note: "Check your reservations and view your past visit history",

    label_name: "Full name *",
    placeholder_name: "Full name",
    label_name_kana: "Full name (Katakana) *",
    placeholder_name_kana: "Katakana (if applicable)",
    label_tel: "Phone number *",
    placeholder_tel: "09012345678",
    note_tel: "Hyphens are optional",
    label_email: "Email address *",
    placeholder_email: "example@gmail.com",
    note_email: "Used to check your reservation and for automatic cancellation notices",
    label_memo: "Requests / Notes",
    placeholder_memo: "Please enter any requests or notes",
    btn_to_step2: "Next (Reservation details)",

    label_date: "Preferred date *",
    label_staff: "Staff *",
    staff_placeholder_option: "Please select a staff member",
    menu_select_placeholder: "Please select a menu",
    menu_loading: "Loading menu...",
    label_menu: "Menu",
    label_menu_multi_note: " (multiple selection allowed)",
    btn_back: "⬅ Back",
    btn_to_step3: "Next (Select date & time)",

    label_datetime_select: "Please select your preferred date & time *",
    btn_prev_timetable: "⬅ Previous dates",
    btn_next_timetable: "Next dates ➔",
    timetable_loading: "Loading availability in real time...",
    timetable_placeholder: "Showing available slots based on your selection.",
    submit_btn_default: "Please select a date & time",
    submit_btn_confirm: "Confirm reservation with the above details",
    submit_btn_provisional: "Request provisional reservation with the above details",
    submit_btn_neutral: "Submit reservation with the above details",
    submit_btn_change: "Confirm change with the above details",
    submit_btn_change_provisional: "Change with the above details (as a provisional reservation)",
    submit_btn_sending_new: "Submitting reservation...",
    submit_btn_sending_change: "Submitting change...",
    loading_slots: "Loading availability...",

    mypage_title: "Check / Cancel Your Reservation",
    label_check_tel: "Registered phone number",
    label_check_email: "Registered email address",
    note_check: "We search using the \"phone number\" and \"email address\" entered at the time of booking.",
    btn_back_to_new: "⬅ Back (New reservation)",
    btn_check: "Check my reservations",
    btn_checking: "Searching...",
    tab_current: "Current reservations",
    tab_history: "Past history",
    tab_waitlist: "Waitlist",
    check_placeholder: "Please enter your details and press the search button.",
    btn_back_to_form: "⬅ Back to reservation form",

    confirm_cancel_btn: "Cancel",
    confirm_ok_btn: "Yes",

    err_fill_customer_info: "Please fill in your information correctly.",
    err_select_date_staff_menu: "Please select a preferred date, staff member, and menu.",
    err_select_all_for_timetable: "Please select a date, staff member, and menu.",
    err_fill_tel_email: "Please enter both your phone number and email address.",
    err_network: "A communication error occurred. Please try again later.",
    err_network_short: "A communication error occurred.",
    err_process_failed_prefix: "Processing failed: ",
    err_page_load_failed: "Failed to load the page. Please try again later.",
    page_loading: "Loading...",

    confirm_change_reservation: "Are you sure you want to change your reservation to the new date/time selected?",
    confirm_change_provisional: "Changing to this new date/time will make this a <span class=\"custom-confirm-highlight\">provisional reservation</span>. Is that OK?",
    confirm_submit_provisional: "Are you sure you want to request a <span class=\"custom-confirm-highlight\">provisional reservation</span> with these details?",
    confirm_submit_neutral: "Are you sure you want to submit a reservation with these details?",
    confirm_submit_normal: "Are you sure you want to confirm a reservation with these details?",
    change_success: "Your reservation has been successfully changed!",
    change_success_provisional: "Your change has been submitted as a provisional reservation!",
    reservation_success_provisional: "Your provisional reservation request has been submitted!",
    reservation_success_normal: "Your reservation is complete!",
    reservation_id_suffix: "[Reservation ID: {resId}]",

    err_waitlist_during_change: "You cannot join the waitlist while changing a reservation.",
    err_waitlist_fill_info: "Please enter your name, phone number, and menu before joining the waitlist.",
    waitlist_confirm_msg: "{date} {time}~ is currently fully booked.<br>Would you like us to email you if a slot opens up?",
    waitlist_register_success: "You have been added to the waitlist.",
    waitlist_register_fail: "Registration failed.",

    confirm_cancel_reservation: "Are you sure you want to cancel this reservation (ID: {resId})?\n\n*This action cannot be undone.",
    cancelling_in_progress: "Cancelling your reservation...",
    cancel_success: "Your reservation has been successfully cancelled.",
    cancel_fail_prefix: "Cancellation failed: ",

    searching_reservations: "Searching for your reservations...",
    no_reservations: "No upcoming reservations were found matching your details.",
    search_error: "An error occurred. Please try again later.",
    results_title_current: "Your reservations",
    searching_history: "Searching your visit history...",
    no_history: "No past visit history found.",
    results_title_history: "Past visit history",

    res_label_memo: "Notes",
    res_label_date: "Date",
    res_label_time: "Time",
    res_label_menu: "Menu",
    res_label_staff: "Staff",
    res_label_id: "Reservation ID",
    res_created_at_prefix: "⏱ Booked at: ",
    btn_change_reservation: "Change date/time",
    btn_change_expired: "Change deadline has passed",
    btn_cancel_reservation: "Cancel this reservation",
    btn_cancel_expired: "Cancellation deadline has passed",
    history_label_date: "Visit date",
    history_label_time: "Time",
    history_status_visited: "Visited",
    history_status_cancelled: "Cancelled",

    searching_waitlist: "Searching your waitlist entries...",
    no_waitlist: "You have no waitlist entries at this time.",
    results_title_waitlist: "Your waitlist status",
    waitlist_label_date: "Requested date",
    waitlist_label_time: "Requested time",
    waitlist_status_waiting: "Waiting",
    waitlist_status_notifying: "Being notified",
    waitlist_status_notified: "Notified",

    unit_minutes: " min",
    approx_suffix: "~",
    total_minutes_prefix: "Total ",
    total_price_prefix: "Total ￥"
  },

  // ===============================================================
  // 한국어 (Korean)
  // ===============================================================
  ko: {
    lang_switcher_label: "언어 / Language",

    change_banner_status: "현재 <strong>【예약 일시 변경 중】</strong> 입니다.",
    change_banner_prev_title: "【변경 전 예약 내용】",
    change_banner_label_datetime: "일시:",
    change_banner_label_menu: "메뉴:",
    change_banner_label_staff: "담당자:",
    change_banner_label_id: "예약 ID:",
    change_banner_instruction: "새로운 일시를 선택하신 후, 가장 아래의 「변경 확정」 버튼을 눌러주세요.",
    change_banner_cancel_btn: "➔ 변경 취소",

    step_label_1: "고객 정보 입력",
    step_label_2: "예약 조건 선택",
    step_label_3: "일시 선택・확정",

    home_btn_fallback: "처음 화면으로 돌아가기",
    mypage_link: "➔ 마이페이지",
    mypage_note: "예약 확인 및 과거 예약 내역을 확인하실 수 있습니다",

    label_name: "성함 (전체 이름) *",
    placeholder_name: "성함을 입력해주세요",
    label_name_kana: "후리가나 (일본어 발음 표기) *",
    placeholder_name_kana: "가타카나",
    label_tel: "전화번호 *",
    placeholder_tel: "09012345678",
    note_tel: "하이픈(-)은 있어도 없어도 됩니다",
    label_email: "이메일 주소 *",
    placeholder_email: "example@gmail.com",
    note_email: "예약 확인 및 자동 취소 안내에 사용됩니다",
    label_memo: "요청사항・비고",
    placeholder_memo: "상담 내용이나 요청사항이 있으시면 입력해주세요",
    btn_to_step2: "다음으로 (예약 조건 선택)",

    label_date: "희망 방문일 *",
    label_staff: "담당 스태프 *",
    staff_placeholder_option: "담당 스태프를 선택해주세요",
    menu_select_placeholder: "메뉴를 선택해주세요",
    menu_loading: "메뉴를 불러오는 중입니다...",
    label_menu: "시술 메뉴",
    label_menu_multi_note: " (복수 선택 가능)",
    btn_back: "⬅ 뒤로",
    btn_to_step3: "다음으로 (예약 가능 일시 선택)",

    label_datetime_select: "희망하시는 방문 일시를 선택해주세요 *",
    btn_prev_timetable: "⬅ 이전 일정 보기",
    btn_next_timetable: "다음 일정 보기 ➔",
    timetable_loading: "예약 가능 현황을 실시간으로 불러오는 중입니다...",
    timetable_placeholder: "선택하신 조건에 맞는 예약 가능 시간을 표시하고 있습니다.",
    submit_btn_default: "일시를 선택해주세요",
    submit_btn_confirm: "위 내용으로 예약을 확정합니다",
    submit_btn_provisional: "위 내용으로 임시 예약을 신청합니다",
    submit_btn_neutral: "위 내용으로 예약을 전송합니다",
    submit_btn_change: "위 내용으로 변경을 확정합니다",
    submit_btn_change_provisional: "위 내용으로 변경하고, 임시 예약으로 신청합니다",
    submit_btn_sending_new: "예약 등록 중...",
    submit_btn_sending_change: "예약 변경 중...",
    loading_slots: "예약 가능 현황을 불러오는 중...",

    mypage_title: "예약 확인・취소",
    label_check_tel: "등록하신 전화번호",
    label_check_email: "등록하신 이메일 주소",
    note_check: "예약 시 입력하신 「전화번호」와 「이메일 주소」로 검색합니다.",
    btn_back_to_new: "⬅ 뒤로 (신규 예약)",
    btn_check: "예약 현황 확인하기",
    btn_checking: "검색 중...",
    tab_current: "현재 예약",
    tab_history: "이용 내역",
    tab_waitlist: "취소 대기",
    check_placeholder: "정보를 입력하시고 확인 버튼을 눌러주세요.",
    btn_back_to_form: "⬅ 예약 화면으로 돌아가기",

    confirm_cancel_btn: "취소",
    confirm_ok_btn: "예",

    err_fill_customer_info: "고객 정보를 정확히 입력해주세요.",
    err_select_date_staff_menu: "희망 방문일, 담당 스태프, 메뉴를 선택해주세요.",
    err_select_all_for_timetable: "날짜, 담당 스태프, 메뉴를 모두 선택해주세요.",
    err_fill_tel_email: "전화번호와 이메일 주소를 모두 입력해주세요.",
    err_network: "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    err_network_short: "통신 오류가 발생했습니다.",
    err_process_failed_prefix: "처리에 실패했습니다: ",
    err_page_load_failed: "페이지를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
    page_loading: "불러오는 중...",

    confirm_change_reservation: "선택하신 새로운 일시로 예약을 변경하시겠습니까？",
    confirm_change_provisional: "선택하신 내용으로 변경하면 <span class=\"custom-confirm-highlight\">임시 예약</span>이 됩니다. 계속하시겠습니까？",
    confirm_submit_provisional: "이 내용으로 <span class=\"custom-confirm-highlight\">임시 예약</span>을 신청하시겠습니까？",
    confirm_submit_neutral: "이 내용으로 예약을 전송하시겠습니까？",
    confirm_submit_normal: "이 내용으로 예약을 확정하시겠습니까？",
    change_success: "예약 변경이 정상적으로 완료되었습니다！",
    change_success_provisional: "변경 내용을 임시 예약으로 신청하였습니다！",
    reservation_success_provisional: "예약을 신청하였습니다！",
    reservation_success_normal: "예약이 완료되었습니다！",
    reservation_id_suffix: "【예약 ID: {resId}】",

    err_waitlist_during_change: "예약 변경 중에는 취소 대기에 등록하실 수 없습니다.",
    err_waitlist_fill_info: "성함・전화번호・메뉴를 입력하신 후 취소 대기에 등록해주세요.",
    waitlist_confirm_msg: "{date} {time}~ 시간대는 현재 예약이 마감되었습니다.<br>빈자리가 생기면 이메일로 안내해드릴까요？",
    waitlist_register_success: "취소 대기 등록이 완료되었습니다.",
    waitlist_register_fail: "등록에 실패했습니다.",

    confirm_cancel_reservation: "예약(ID: {resId})을 취소하시겠습니까？\n\n※이 작업은 되돌릴 수 없습니다.",
    cancelling_in_progress: "예약 취소를 처리하고 있습니다...",
    cancel_success: "예약 취소가 정상적으로 완료되었습니다.",
    cancel_fail_prefix: "취소에 실패했습니다: ",

    searching_reservations: "예약 정보를 검색하고 있습니다...",
    no_reservations: "조건에 맞는 오늘 이후의 예약이 없습니다.",
    search_error: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    results_title_current: "고객님의 예약 현황",
    searching_history: "이용 내역을 검색하고 있습니다...",
    no_history: "과거 이용 내역이 없습니다.",
    results_title_history: "과거 이용 내역",

    res_label_memo: "비고",
    res_label_date: "예약일",
    res_label_time: "예약 시간",
    res_label_menu: "메뉴",
    res_label_staff: "담당",
    res_label_id: "예약 ID",
    res_created_at_prefix: "⏱ 접수 시간: ",
    btn_change_reservation: "일시 변경하기",
    btn_change_expired: "변경 가능 기간이 지났습니다",
    btn_cancel_reservation: "이 예약 취소하기",
    btn_cancel_expired: "취소 가능 기한이 지났습니다",
    history_label_date: "방문일",
    history_label_time: "시간",
    history_status_visited: "방문 완료",
    history_status_cancelled: "취소됨",

    searching_waitlist: "취소 대기 등록 내역을 검색하고 있습니다...",
    no_waitlist: "현재 등록된 취소 대기 내역이 없습니다.",
    results_title_waitlist: "취소 대기 등록 현황",
    waitlist_label_date: "희망일",
    waitlist_label_time: "희망 시간",
    waitlist_status_waiting: "대기 중",
    waitlist_status_notifying: "안내 중",
    waitlist_status_notified: "안내 완료",

    unit_minutes: "분",
    approx_suffix: "~",
    total_minutes_prefix: "합계 ",
    total_price_prefix: "합계 ￥"
  },

  // ===============================================================
  // 简体中文 (Simplified Chinese)
  // ===============================================================
  "zh-CN": {
    lang_switcher_label: "语言 / Language",

    change_banner_status: "当前 <strong>【正在变更预约日期时间】</strong>。",
    change_banner_prev_title: "【变更前的预约内容】",
    change_banner_label_datetime: "日期时间:",
    change_banner_label_menu: "项目:",
    change_banner_label_staff: "负责人:",
    change_banner_label_id: "预约编号:",
    change_banner_instruction: "请选择新的日期时间，然后点击最下方的「确认变更」按钮。",
    change_banner_cancel_btn: "➔ 取消变更",

    step_label_1: "填写顾客信息",
    step_label_2: "选择预约内容",
    step_label_3: "选择日期时间",

    home_btn_fallback: "返回首页",
    mypage_link: "➔ 我的页面",
    mypage_note: "可查看预约信息及过往到店记录",

    label_name: "姓名 (全名) *",
    placeholder_name: "请输入姓名",
    label_name_kana: "姓名假名注音 *",
    placeholder_name_kana: "片假名",
    label_tel: "电话号码 *",
    placeholder_tel: "09012345678",
    note_tel: "可以带「-」，也可以不带",
    label_email: "电子邮箱 *",
    placeholder_email: "example@gmail.com",
    note_email: "用于查询预约及自动取消通知",
    label_memo: "备注・其他要求",
    placeholder_memo: "如有咨询或其他要求，请在此填写",
    btn_to_step2: "下一步 (选择预约内容)",

    label_date: "希望到店日期 *",
    label_staff: "指定美发师 *",
    staff_placeholder_option: "请选择美发师",
    menu_select_placeholder: "请选择服务项目",
    menu_loading: "正在加载服务项目...",
    label_menu: "服务项目",
    label_menu_multi_note: "（可多选）",
    btn_back: "⬅ 返回",
    btn_to_step3: "下一步 (选择可预约时间)",

    label_datetime_select: "请选择您希望到店的日期时间 *",
    btn_prev_timetable: "⬅ 查看更早的日期",
    btn_next_timetable: "查看更晚的日期 ➔",
    timetable_loading: "正在实时读取可预约状况...",
    timetable_placeholder: "正在显示符合条件的可预约时段。",
    submit_btn_default: "请选择日期时间",
    submit_btn_confirm: "确认以上内容并预约",
    submit_btn_provisional: "以上内容申请临时预约",
    submit_btn_neutral: "提交以上预约内容",
    submit_btn_change: "确认以上内容并变更",
    submit_btn_change_provisional: "以上内容变更，并作为临时预约申请",
    submit_btn_sending_new: "预约提交中...",
    submit_btn_sending_change: "预约变更中...",
    loading_slots: "正在读取可预约状况...",

    mypage_title: "预约确认・取消",
    label_check_tel: "登记的电话号码",
    label_check_email: "登记的电子邮箱",
    note_check: "将使用预约时填写的「电话号码」与「电子邮箱」进行查询。",
    btn_back_to_new: "⬅ 返回（新预约）",
    btn_check: "查询预约状况",
    btn_checking: "查询中...",
    tab_current: "当前预约",
    tab_history: "过往记录",
    tab_waitlist: "候补等待",
    check_placeholder: "请输入信息后点击查询按钮。",
    btn_back_to_form: "⬅ 返回预约表单",

    confirm_cancel_btn: "取消",
    confirm_ok_btn: "是",

    err_fill_customer_info: "请正确填写顾客信息。",
    err_select_date_staff_menu: "请选择希望到店日期、美发师及服务项目。",
    err_select_all_for_timetable: "请选择日期、美发师及服务项目。",
    err_fill_tel_email: "请填写电话号码和电子邮箱。",
    err_network: "发生通信错误，请稍后重试。",
    err_network_short: "发生通信错误。",
    err_process_failed_prefix: "处理失败：",
    err_page_load_failed: "页面加载失败，请稍后重试。",
    page_loading: "加载中...",

    confirm_change_reservation: "确定要将预约变更为所选的新日期时间吗？",
    confirm_change_provisional: "变更为所选内容后，将成为<span class=\"custom-confirm-highlight\">临时预约</span>。是否继续？",
    confirm_submit_provisional: "确定要以此内容申请<span class=\"custom-confirm-highlight\">临时预约</span>吗？",
    confirm_submit_neutral: "确定要提交此预约内容吗？",
    confirm_submit_normal: "确定要以此内容确认预约吗？",
    change_success: "预约变更已成功完成！",
    change_success_provisional: "变更内容已作为临时预约提交申请！",
    reservation_success_provisional: "已提交预约申请！",
    reservation_success_normal: "预约已完成！",
    reservation_id_suffix: "【预约编号：{resId}】",

    err_waitlist_during_change: "变更预约期间，无法登记候补等待。",
    err_waitlist_fill_info: "请先填写姓名・电话号码・服务项目，再登记候补等待。",
    waitlist_confirm_msg: "{date} {time}~ 目前已满。<br>如有空位是否需要通过邮件通知您？",
    waitlist_register_success: "候补等待登记已完成。",
    waitlist_register_fail: "登记失败。",

    confirm_cancel_reservation: "确定要取消该预约（编号：{resId}）吗？\n\n※此操作无法撤销。",
    cancelling_in_progress: "正在处理预约取消...",
    cancel_success: "预约取消已成功完成。",
    cancel_fail_prefix: "取消失败：",

    searching_reservations: "正在查询预约信息...",
    no_reservations: "未找到符合条件的今日以后的预约。",
    search_error: "发生错误，请稍后重试。",
    results_title_current: "您的预约情况",
    searching_history: "正在查询到店记录...",
    no_history: "暂无过往到店记录。",
    results_title_history: "过往到店记录",

    res_label_memo: "备注",
    res_label_date: "预约日期",
    res_label_time: "预约时间",
    res_label_menu: "项目",
    res_label_staff: "负责人",
    res_label_id: "预约编号",
    res_created_at_prefix: "⏱ 提交时间：",
    btn_change_reservation: "变更日期时间",
    btn_change_expired: "已超过变更受理时间",
    btn_cancel_reservation: "取消此预约",
    btn_cancel_expired: "已超过取消受理时间",
    history_label_date: "到店日期",
    history_label_time: "时间",
    history_status_visited: "已到店",
    history_status_cancelled: "已取消",

    searching_waitlist: "正在查询候补等待登记...",
    no_waitlist: "目前没有候补等待登记。",
    results_title_waitlist: "候补等待登记情况",
    waitlist_label_date: "希望日期",
    waitlist_label_time: "希望时间",
    waitlist_status_waiting: "等待中",
    waitlist_status_notifying: "通知中",
    waitlist_status_notified: "已通知",

    unit_minutes: "分钟",
    approx_suffix: "～",
    total_minutes_prefix: "合计 ",
    total_price_prefix: "合计 ￥"
  },

  // ===============================================================
  // 繁體中文 (Traditional Chinese)
  // ===============================================================
  "zh-TW": {
    lang_switcher_label: "語言 / Language",

    change_banner_status: "目前 <strong>【正在變更預約日期時間】</strong>。",
    change_banner_prev_title: "【變更前的預約內容】",
    change_banner_label_datetime: "日期時間:",
    change_banner_label_menu: "項目:",
    change_banner_label_staff: "負責人:",
    change_banner_label_id: "預約編號:",
    change_banner_instruction: "請選擇新的日期時間，然後點擊最下方的「確認變更」按鈕。",
    change_banner_cancel_btn: "➔ 取消變更",

    step_label_1: "填寫顧客資訊",
    step_label_2: "選擇預約內容",
    step_label_3: "選擇日期時間",

    home_btn_fallback: "返回首頁",
    mypage_link: "➔ 我的頁面",
    mypage_note: "可查看預約資訊及過往到店紀錄",

    label_name: "姓名 (全名) *",
    placeholder_name: "請輸入姓名",
    label_name_kana: "姓名假名注音 *",
    placeholder_name_kana: "片假名",
    label_tel: "電話號碼 *",
    placeholder_tel: "09012345678",
    note_tel: "可以帶「-」，也可以不帶",
    label_email: "電子郵件信箱 *",
    placeholder_email: "example@gmail.com",
    note_email: "用於查詢預約及自動取消通知",
    label_memo: "備註・其他需求",
    placeholder_memo: "如有諮詢或其他需求，請在此填寫",
    btn_to_step2: "下一步 (選擇預約內容)",

    label_date: "希望到店日期 *",
    label_staff: "指定美髮師 *",
    staff_placeholder_option: "請選擇美髮師",
    menu_select_placeholder: "請選擇服務項目",
    menu_loading: "正在載入服務項目...",
    label_menu: "服務項目",
    label_menu_multi_note: "（可複選）",
    btn_back: "⬅ 返回",
    btn_to_step3: "下一步 (選擇可預約時間)",

    label_datetime_select: "請選擇您希望到店的日期時間 *",
    btn_prev_timetable: "⬅ 查看更早的日期",
    btn_next_timetable: "查看更晚的日期 ➔",
    timetable_loading: "正在即時讀取可預約狀況...",
    timetable_placeholder: "正在顯示符合條件的可預約時段。",
    submit_btn_default: "請選擇日期時間",
    submit_btn_confirm: "確認以上內容並預約",
    submit_btn_provisional: "以上內容申請臨時預約",
    submit_btn_neutral: "提交以上預約內容",
    submit_btn_change: "確認以上內容並變更",
    submit_btn_change_provisional: "以上內容變更，並作為臨時預約申請",
    submit_btn_sending_new: "預約提交中...",
    submit_btn_sending_change: "預約變更中...",
    loading_slots: "正在讀取可預約狀況...",

    mypage_title: "預約確認・取消",
    label_check_tel: "登記的電話號碼",
    label_check_email: "登記的電子郵件信箱",
    note_check: "將使用預約時填寫的「電話號碼」與「電子郵件信箱」進行查詢。",
    btn_back_to_new: "⬅ 返回（新預約）",
    btn_check: "查詢預約狀況",
    btn_checking: "查詢中...",
    tab_current: "目前預約",
    tab_history: "過往紀錄",
    tab_waitlist: "候補等待",
    check_placeholder: "請輸入資訊後點擊查詢按鈕。",
    btn_back_to_form: "⬅ 返回預約表單",

    confirm_cancel_btn: "取消",
    confirm_ok_btn: "是",

    err_fill_customer_info: "請正確填寫顧客資訊。",
    err_select_date_staff_menu: "請選擇希望到店日期、美髮師及服務項目。",
    err_select_all_for_timetable: "請選擇日期、美髮師及服務項目。",
    err_fill_tel_email: "請填寫電話號碼和電子郵件信箱。",
    err_network: "發生通訊錯誤，請稍後再試。",
    err_network_short: "發生通訊錯誤。",
    err_process_failed_prefix: "處理失敗：",
    err_page_load_failed: "頁面載入失敗，請稍後再試。",
    page_loading: "載入中...",

    confirm_change_reservation: "確定要將預約變更為所選的新日期時間嗎？",
    confirm_change_provisional: "變更為所選內容後，將成為<span class=\"custom-confirm-highlight\">臨時預約</span>。是否繼續？",
    confirm_submit_provisional: "確定要以此內容申請<span class=\"custom-confirm-highlight\">臨時預約</span>嗎？",
    confirm_submit_neutral: "確定要提交此預約內容嗎？",
    confirm_submit_normal: "確定要以此內容確認預約嗎？",
    change_success: "預約變更已成功完成！",
    change_success_provisional: "變更內容已作為臨時預約提交申請！",
    reservation_success_provisional: "已提交預約申請！",
    reservation_success_normal: "預約已完成！",
    reservation_id_suffix: "【預約編號：{resId}】",

    err_waitlist_during_change: "變更預約期間，無法登記候補等待。",
    err_waitlist_fill_info: "請先填寫姓名・電話號碼・服務項目，再登記候補等待。",
    waitlist_confirm_msg: "{date} {time}~ 目前已滿。<br>如有空位是否需要透過郵件通知您？",
    waitlist_register_success: "候補等待登記已完成。",
    waitlist_register_fail: "登記失敗。",

    confirm_cancel_reservation: "確定要取消該預約（編號：{resId}）嗎？\n\n※此操作無法復原。",
    cancelling_in_progress: "正在處理預約取消...",
    cancel_success: "預約取消已成功完成。",
    cancel_fail_prefix: "取消失敗：",

    searching_reservations: "正在查詢預約資訊...",
    no_reservations: "未找到符合條件的今日以後的預約。",
    search_error: "發生錯誤，請稍後再試。",
    results_title_current: "您的預約情況",
    searching_history: "正在查詢到店紀錄...",
    no_history: "暫無過往到店紀錄。",
    results_title_history: "過往到店紀錄",

    res_label_memo: "備註",
    res_label_date: "預約日期",
    res_label_time: "預約時間",
    res_label_menu: "項目",
    res_label_staff: "負責人",
    res_label_id: "預約編號",
    res_created_at_prefix: "⏱ 提交時間：",
    btn_change_reservation: "變更日期時間",
    btn_change_expired: "已超過變更受理時間",
    btn_cancel_reservation: "取消此預約",
    btn_cancel_expired: "已超過取消受理時間",
    history_label_date: "到店日期",
    history_label_time: "時間",
    history_status_visited: "已到店",
    history_status_cancelled: "已取消",

    searching_waitlist: "正在查詢候補等待登記...",
    no_waitlist: "目前沒有候補等待登記。",
    results_title_waitlist: "候補等待登記情況",
    waitlist_label_date: "希望日期",
    waitlist_label_time: "希望時間",
    waitlist_status_waiting: "等待中",
    waitlist_status_notifying: "通知中",
    waitlist_status_notified: "已通知",

    unit_minutes: "分鐘",
    approx_suffix: "～",
    total_minutes_prefix: "合計 ",
    total_price_prefix: "合計 ￥"
  },

  // ===============================================================
  // Français (French)
  // ===============================================================
  fr: {
    lang_switcher_label: "Langue / Language",

    change_banner_status: "Vous êtes actuellement en train de <strong>modifier la date/l'heure de votre réservation</strong>.",
    change_banner_prev_title: "[Détails de la réservation avant modification]",
    change_banner_label_datetime: "Date/Heure :",
    change_banner_label_menu: "Prestation :",
    change_banner_label_staff: "Coiffeur(se) :",
    change_banner_label_id: "N° de réservation :",
    change_banner_instruction: "Veuillez sélectionner une nouvelle date/heure, puis cliquez sur le bouton « Confirmer la modification » en bas de page.",
    change_banner_cancel_btn: "➔ Annuler la modification",

    step_label_1: "Vos informations",
    step_label_2: "Détails de la réservation",
    step_label_3: "Choix de la date et de l'heure",

    home_btn_fallback: "Retour à l'accueil",
    mypage_link: "➔ Mon espace",
    mypage_note: "Consultez vos réservations et votre historique de visites",

    label_name: "Nom complet *",
    placeholder_name: "Nom complet",
    label_name_kana: "Nom en katakana *",
    placeholder_name_kana: "Katakana (le cas échéant)",
    label_tel: "Numéro de téléphone *",
    placeholder_tel: "09012345678",
    note_tel: "Les tirets sont facultatifs",
    label_email: "Adresse e-mail *",
    placeholder_email: "example@gmail.com",
    note_email: "Utilisée pour la confirmation de réservation et les avis d'annulation automatique",
    label_memo: "Demandes / Remarques",
    placeholder_memo: "Veuillez indiquer toute demande particulière",
    btn_to_step2: "Suivant (Détails de la réservation)",

    label_date: "Date souhaitée *",
    label_staff: "Coiffeur(se) *",
    staff_placeholder_option: "Veuillez sélectionner un(e) coiffeur(se)",
    menu_select_placeholder: "Veuillez sélectionner une prestation",
    menu_loading: "Chargement des prestations...",
    label_menu: "Prestations",
    label_menu_multi_note: " (sélection multiple possible)",
    btn_back: "⬅ Retour",
    btn_to_step3: "Suivant (Choix de la date et de l'heure)",

    label_datetime_select: "Veuillez choisir la date et l'heure souhaitées *",
    btn_prev_timetable: "⬅ Dates précédentes",
    btn_next_timetable: "Dates suivantes ➔",
    timetable_loading: "Chargement des disponibilités en temps réel...",
    timetable_placeholder: "Affichage des créneaux disponibles selon votre sélection.",
    submit_btn_default: "Veuillez choisir une date et une heure",
    submit_btn_confirm: "Confirmer la réservation avec ces informations",
    submit_btn_provisional: "Demander une réservation provisoire avec ces informations",
    submit_btn_neutral: "Envoyer la réservation avec ces informations",
    submit_btn_change: "Confirmer la modification avec ces informations",
    submit_btn_change_provisional: "Modifier avec ces informations (comme réservation provisoire)",
    submit_btn_sending_new: "Envoi de la réservation en cours...",
    submit_btn_sending_change: "Modification en cours...",
    loading_slots: "Chargement des disponibilités...",

    mypage_title: "Vérifier / Annuler votre réservation",
    label_check_tel: "Numéro de téléphone enregistré",
    label_check_email: "Adresse e-mail enregistrée",
    note_check: "La recherche s'effectue à partir du « numéro de téléphone » et de l'« adresse e-mail » saisis lors de la réservation.",
    btn_back_to_new: "⬅ Retour (Nouvelle réservation)",
    btn_check: "Vérifier ma réservation",
    btn_checking: "Recherche en cours...",
    tab_current: "Réservations actuelles",
    tab_history: "Historique",
    tab_waitlist: "Liste d'attente",
    check_placeholder: "Veuillez saisir vos informations puis cliquer sur le bouton de recherche.",
    btn_back_to_form: "⬅ Retour au formulaire de réservation",

    confirm_cancel_btn: "Annuler",
    confirm_ok_btn: "Oui",

    err_fill_customer_info: "Veuillez renseigner correctement vos informations.",
    err_select_date_staff_menu: "Veuillez sélectionner une date, un(e) coiffeur(se) et une prestation.",
    err_select_all_for_timetable: "Veuillez sélectionner une date, un(e) coiffeur(se) et une prestation.",
    err_fill_tel_email: "Veuillez renseigner votre numéro de téléphone et votre adresse e-mail.",
    err_network: "Une erreur de communication s'est produite. Veuillez réessayer plus tard.",
    err_network_short: "Une erreur de communication s'est produite.",
    err_process_failed_prefix: "Échec du traitement : ",
    err_page_load_failed: "Échec du chargement de la page. Veuillez réessayer plus tard.",
    page_loading: "Chargement...",

    confirm_change_reservation: "Confirmez-vous la modification de votre réservation à la nouvelle date/heure sélectionnée ?",
    confirm_change_provisional: "Ce changement fera de votre réservation une <span class=\"custom-confirm-highlight\">réservation provisoire</span>. Confirmez-vous ?",
    confirm_submit_provisional: "Confirmez-vous la demande de <span class=\"custom-confirm-highlight\">réservation provisoire</span> avec ces informations ?",
    confirm_submit_neutral: "Confirmez-vous l'envoi de la réservation avec ces informations ?",
    confirm_submit_normal: "Confirmez-vous la réservation avec ces informations ?",
    change_success: "Votre réservation a été modifiée avec succès !",
    change_success_provisional: "Votre modification a été envoyée en tant que réservation provisoire !",
    reservation_success_provisional: "Votre demande de réservation a été envoyée !",
    reservation_success_normal: "Votre réservation est confirmée !",
    reservation_id_suffix: "[N° de réservation : {resId}]",

    err_waitlist_during_change: "Vous ne pouvez pas vous inscrire sur liste d'attente pendant la modification d'une réservation.",
    err_waitlist_fill_info: "Veuillez renseigner votre nom, numéro de téléphone et la prestation avant de vous inscrire sur liste d'attente.",
    waitlist_confirm_msg: "Le créneau du {date} à {time} est actuellement complet.<br>Souhaitez-vous être averti(e) par e-mail en cas de disponibilité ?",
    waitlist_register_success: "Votre inscription sur liste d'attente est confirmée.",
    waitlist_register_fail: "Échec de l'inscription.",

    confirm_cancel_reservation: "Confirmez-vous l'annulation de cette réservation (N° {resId}) ?\n\n*Cette action est irréversible.",
    cancelling_in_progress: "Annulation de votre réservation en cours...",
    cancel_success: "Votre réservation a été annulée avec succès.",
    cancel_fail_prefix: "Échec de l'annulation : ",

    searching_reservations: "Recherche de vos réservations en cours...",
    no_reservations: "Aucune réservation à venir trouvée correspondant à vos informations.",
    search_error: "Une erreur s'est produite. Veuillez réessayer plus tard.",
    results_title_current: "Vos réservations",
    searching_history: "Recherche de votre historique de visites...",
    no_history: "Aucun historique de visite trouvé.",
    results_title_history: "Historique de visites",

    res_label_memo: "Remarques",
    res_label_date: "Date",
    res_label_time: "Heure",
    res_label_menu: "Prestation",
    res_label_staff: "Coiffeur(se)",
    res_label_id: "N° de réservation",
    res_created_at_prefix: "⏱ Réservé le : ",
    btn_change_reservation: "Modifier la date/l'heure",
    btn_change_expired: "Le délai de modification est dépassé",
    btn_cancel_reservation: "Annuler cette réservation",
    btn_cancel_expired: "Le délai d'annulation est dépassé",
    history_label_date: "Date de visite",
    history_label_time: "Heure",
    history_status_visited: "Visité",
    history_status_cancelled: "Annulé",

    searching_waitlist: "Recherche de vos inscriptions en liste d'attente...",
    no_waitlist: "Vous n'avez aucune inscription en liste d'attente pour le moment.",
    results_title_waitlist: "Votre liste d'attente",
    waitlist_label_date: "Date souhaitée",
    waitlist_label_time: "Heure souhaitée",
    waitlist_status_waiting: "En attente",
    waitlist_status_notifying: "Notification en cours",
    waitlist_status_notified: "Notifié(e)",

    unit_minutes: " min",
    approx_suffix: "~",
    total_minutes_prefix: "Total ",
    total_price_prefix: "Total ￥"
  }
};

// 現在選ばれている言語（ブラウザに記憶させる。未選択なら日本語）
let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('sis_lang')) || 'ja';
if (!I18N_STRINGS[currentLang]) currentLang = 'ja';

/**
 * 指定したキーの、現在の言語の文言を返す
 * @param {string} key - 辞書のキー名
 * @param {Object} [vars] - 文言中の {変数名} に差し込む値
 * @returns {string}
 */
function t(key, vars) {
  const dict = I18N_STRINGS[currentLang] || I18N_STRINGS.ja;
  let str = (dict[key] !== undefined) ? dict[key] : (I18N_STRINGS.ja[key] !== undefined ? I18N_STRINGS.ja[key] : key);

  if (vars) {
    Object.keys(vars).forEach(k => {
      str = str.split('{' + k + '}').join(vars[k]);
    });
  }
  return str;
}

/**
 * 画面上の data-i18n / data-i18n-placeholder / data-i18n-html 属性が付いた要素すべてに、
 * 現在の言語の文言を反映する
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
}

/**
 * 表示言語を切り替える
 * @param {string} lang - 言語コード（ja / en / ko / zh-CN / zh-TW / fr）
 */
function setLanguage(lang) {
  if (!I18N_STRINGS[lang]) lang = 'ja';
  currentLang = lang;
  try {
    localStorage.setItem('sis_lang', lang);
  } catch (e) {
    // プライベートブラウズ等でlocalStorageが使えない場合は、記憶せず今回の表示だけ切り替える
  }
  document.documentElement.lang = lang;
  applyTranslations();

  // 送信ボタンなど、状態によって動的に文言が変わる要素は、各画面側のロジックで再計算してもらう
  if (typeof onLanguageChanged === 'function') {
    onLanguageChanged();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = currentLang;

  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', () => setLanguage(langSelect.value));
  }

  applyTranslations();
});
