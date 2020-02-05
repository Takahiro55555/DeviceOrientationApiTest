//参考URL: https://tknc.jp/tp_detail.php?id=1116
let isGyro = false;
const gyroUpdateIntervalSec = 1;
let gyroBeforeUpdate = 0;
if ((window.DeviceOrientationEvent) && ('ontouchstart' in window)) {
    isGyro = true;
    logPrintln("ジャイロセンサーを搭載しています");
}

//PCなど非ジャイロ
if (!isGyro) {
    // ここに何か関数
    errorPrintln("ジャイロセンサーを搭載していません");
    //一応ジャイロ持ちデバイス
} else {
    //ジャイロ動作確認
    let resGyro = false;
    window.addEventListener("deviceorientation", doGyro, false);
    function doGyro() {
        resGyro = true;
        window.removeEventListener("deviceorientation", doGyro, false);
        gyroIsAllowed();

        //参考URL: https://kkblab.com/make/javascript/gyro.html
        // ジャイロセンサの値が変化したら実行される deviceorientation イベント
        window.addEventListener("deviceorientation", (dat) => {
            if (performance.now() - gyroBeforeUpdate > gyroUpdateIntervalSec) {
                return;
            }
            gyroBeforeUpdate = performance.now();
            alpha = dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
            beta = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
            gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
            msg = "a: " + alpha + ", b: " + beta + ", g: " + gamma;
            logPrintln(msg);
        });
    }

    //数秒後に判定
    setTimeout(function () {
        //ジャイロが動いた
        if (resGyro) {
            // ここに何か関数
            gyroIsAllowed();

            //ジャイロ持ってるくせに動かなかった
        } else {
            gyroIsNotAllowed();
            //iOS13+方式ならクリックイベントを要求
            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                //ユーザアクションを得るための要素を表示
                logPrintln("iOS13+方式です");
                const body = document.getElementById("body");
                body.onclick = function () {
                    logPrintln("クリックされました");
                    DeviceOrientationEvent.requestPermission().then(res => {
                        logPrintln("許可を確認ダイアログが出現するはずです...");
                        //「動作と方向」が許可された
                        if (res === "granted") {
                            // ここに何か関数
                            gyroIsAllowed();
                            logPrintln("動作と方向が許可されました");
                            //「動作と方向」が許可されなかった
                        } else {
                            isGyro = false;
                            // ここに何か関数
                            gyroIsNotAllowed();
                            logPrintln("動作と方向が許可されませんでした");
                        }
                    });
                };

                //iOS13+じゃない
            } else {
                //早くアップデートしてもらうのを祈りながら諦める
                isGyro = false;
                // ここに何か関数
                logPrintln("早くアップデートしてもらうのを祈りながら諦める");
            }
            gyroIsNotAllowed();
        }
    }, 300);
}

function gyroIsAllowed() {
    msg = "[OK]ジャイロセンサーを利用することが可能になりました";
    logPrintln(msg);
}

function gyroIsNotAllowed() {
    msg = "ジャイロセンサーを利用できません";
    errorPrintln(msg);
}

/**
 * エラーメッセージをhtmlのコンソールエレメントの先頭（1行目）に表示する
 * "error"クラスを適用
 * @param {表示したいメッセージ} msg 
 */
function errorPrintln(msg) {
    const newLogElement = document.createElement("div");
    newLogElement.textContent = "[Error] " + msg;
    newLogElement.className = "error";
    htmlConsolePrintln(newLogElement);
    console.log(msg);
}

/**
 * ログメッセージをhtmlのコンソールエレメントの先頭（1行目）に表示する
 * "log"クラスを適用
 * @param {表示したいメッセージ} msg 
 */
function logPrintln(msg) {
    const newLogElement = document.createElement("div");
    newLogElement.textContent = "[Log] " + msg;
    newLogElement.className = "log";
    htmlConsolePrintln(newLogElement);
    console.log(msg);
}

/**
 * htmlのコンソールエレメントの先頭（1行目）に当該エレメントを追記する
 * @param {htmlのエレメント} element 
 */
function htmlConsolePrintln(element) {
    const consoleElement = document.getElementById("console");
    consoleElement.insertBefore(element, consoleElement.firstChild);
}