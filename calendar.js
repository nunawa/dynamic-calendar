// ページ読み込み時に実行
window.onload = function() {
    generate_selectbox();
}

// セレクトボックス生成
function generate_selectbox() {
    // 設置先の要素取得
    const year = document.getElementById("year");
    const month = document.getElementById("month");

    // セレクトボックスの項目を1900~2021まで作成
    for (let i = 1900; i < 2022; i++) {
        // 要素作成
        let option = document.createElement("option");
        // 値を設定
        option.value = i;
        option.text = i;
        // あらかじめ2021を選択済みにしておく
        if (i == 2021) {
            option.selected = true;
        }
        // 設置先の要素に設置
        year.appendChild(option);
    }

    // セレクトボックスの項目を1~12まで作成
    for (let i = 1; i < 13; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        if (i == 7) {
            option.selected = true;
        }
        month.appendChild(option);
    }
}

// ツェラーの公式
function calc_zeller(y, m) {
    if (m == 1 || m == 2) {
        y -= 1;
        m += 12;
    }

    const d = 1;
    const gamma = Math.floor((13 * m + 8) / 5);
    
    const h = (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + gamma + d) % 7;

    return h;
}

// カレンダー生成
function generate_table() {
    // 設置先の要素取得
    let parent = document.getElementById("table");
    // tableタグ作成
    let tbl = document.createElement("table");

    // 設置先の子要素を全て削除
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }

    // 最初の行を生成
    // 曜日の配列
    const DOWNames = ["日", "月", "火", "水", "木", "金", "土"];
    // trタグ生成
    let row = document.createElement("tr");
    // 曜日配列の数だけtdタグ生成
    for (const i in DOWNames) {
        let cell = document.createElement("td");
        // tdタグ内のテキスト追加（各曜日）
        let cellText = document.createTextNode(DOWNames[i]);
        cell.appendChild(cellText);
        // 生成したtdタグをtrタグの子要素として挿入
        row.appendChild(cell);
    }
    // 生成した行（trタグ）をtableタグの子要素として挿入
    tbl.appendChild(row);

    // セレクトボックスから年月の値を取得
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    // 年月から月初めが何曜日か計算
    // getDay()を使うためにDateオブジェクトを作成
    const date = new Date(year + "/" + month + "/" + "1");
    // 生成したい月の月初の曜日番号（0が日曜日）
    //const firstDOW = date.getDay();
    // parseInt()でキャストしないと戻り値おかしくなる
    const firstDOW = calc_zeller(parseInt(year), parseInt(month));

    // 日にちを入れる行を生成
    // 各月の日数の配列
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 日にちカウント用
    let dayCount = 1;
    // 日にちカウントが生成したい月の日数以下の間ループ
    while (dayCount <= days[month-1]) {
        // trタグ生成
        let row = document.createElement("tr");

        // tdタグ生成（7日分）
        for (let i = 0; i < 7; i++) {
            let cell = document.createElement("td");

            // 1日の位置を決める
            // 日にちカウントが1（月初）かつ、今生成するtdタグの番号が月初の曜日番号と一致した場合
            if (dayCount == 1 && i == firstDOW) {
                // tdタグ内のテキスト追加（日にち）
                let cellText = document.createTextNode(dayCount);
                cell.appendChild(cellText);
                // 日にちカウントに1足す
                dayCount ++;
            // 日にちカウントが1より大きい（1日以降）かつ、日にちカウントが生成したい月の日数以下の場合
            } else if (dayCount > 1 && dayCount <= days[month-1]) {
                // tdタグ内のテキスト追加（日にち）
                let cellText = document.createTextNode(dayCount);
                cell.appendChild(cellText);
                // 日にちカウントに1足す
                dayCount ++;
            }
            
            // 生成したtdタグをtrタグの子要素として挿入
            row.appendChild(cell);
        }

        // 生成した行（trタグ）をtableタグの子要素として挿入
        tbl.appendChild(row);
    }

    // 生成した表（tableタグ）を設置先要素の子要素として挿入
    parent.appendChild(tbl);
    // tableタグの要素を設定（枠線）
    tbl.setAttribute("border", "2");
}