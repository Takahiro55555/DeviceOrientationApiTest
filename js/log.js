/**
 * エラーメッセージをhtmlのコンソールエレメントの先頭（1行目）に表示する
 * "error"クラスを適用
 * @param {string} msg 表示したいメッセージ
 */
function errorPrintln(msg) {
    const newLogElement = document.createElement("div");
    newLogElement.textContent = "[Error] " + msg;
    newLogElement.className = "error";
    htmlLogPrintln(newLogElement);
    console.log(msg);
}

/**
 * ログメッセージをhtmlのコンソールエレメントの先頭（1行目）に表示する
 * "log"クラスを適用
 * @param {string} msg 表示したいメッセージ
 */
function logPrintln(msg) {
    const newLogElement = document.createElement("div");
    newLogElement.textContent = "[Log] " + msg;
    newLogElement.className = "log";
    htmlLogPrintln(newLogElement);
    console.log(msg);
}

/**
 * htmlのログエレメントの先頭（1行目）に当該エレメントを追記する
 * @param {HTMLElement} element htmlのログエレメント
 */
function htmlLogPrintln(element) {
    if (!element) return;
    const consoleElement = document.getElementById("console");
    consoleElement.insertAdjacentElement('beforeend', element);
    let bottom = consoleElement.scrollHeight - consoleElement.clientHeight;
    consoleElement.scroll(0, bottom);
}

/**
 * 
 * @param {number} num 0埋めしたい整数値
 * @param {number} length 0埋めする際の長さ
 */
function zeroPadding(num, length) {
    if(num < 0){
        return '-' + ('00000000000000000' + String(-1*num)).slice(1-length);
    }
    return '0' + ('00000000000000000' + String(num)).slice(1-length);
}