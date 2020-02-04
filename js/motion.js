//ジャイロセンサー確認
var isGyro = false;
if ((window.DeviceOrientationEvent) && ('ontouchstart' in window)) {
    isGyro = true;
    appendMessage("[Log] ジャイロセンサーを搭載しています");
}

//PCなど非ジャイロ
if (!isGyro) {
    // ここに何か関数
    appendMessage("[Log] ジャイロセンサーを搭載していません");
    //一応ジャイロ持ちデバイス
} else {
    //ジャイロ動作確認
    var resGyro = false;
    window.addEventListener("deviceorientation", doGyro, false);
    function doGyro() {
        resGyro = true;
        window.removeEventListener("deviceorientation", doGyro, false);
        gyroIsAllowed();
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
                appendMessage("[Log] iOS13+方式です");
                const body = document.getElementById("title");
                body.onclick = function () {
                    appendMessage("[Log]クリックされました");
                    DeviceOrientationEvent.requestPermission().then(res => {
                        appendMessage("[Log] 許可を確認ダイアログが出現するはずです...");
                        //「動作と方向」が許可された
                        if (res === "granted") {
                            // ここに何か関数
                            gyroIsAllowed();
                            appendMessage("[Log] 動作と方向が許可されました");
                            //「動作と方向」が許可されなかった
                        } else {
                            isGyro = false;
                            // ここに何か関数
                            gyroIsNotAllowed();
                            appendMessage("[Log] 動作と方向が許可されませんでした");
                        }
                    });
                };

                //iOS13+じゃない
            } else {
                //早くアップデートしてもらうのを祈りながら諦める
                isGyro = false;
                // ここに何か関数
                appendMessage("[Log] 早くアップデートしてもらうのを祈りながら諦める");
            }
            gyroIsNotAllowed();
        }
    }, 300);
}

function gyroIsAllowed() {
    msg = "[OK]ジャイロセンサーを利用することが可能になりました";
    appendMessage(msg);
}

function gyroIsNotAllowed() {
    msg = "[ERROR]ジャイロセンサーを利用できません";
    appendMessage(msg);
}

function appendMessage(msg) {
    const msgTag = document.getElementById("msg");
    const newMsgElement = document.createElement("div");
    newMsgElement.textContent = msg;
    msgTag.insertBefore(newMsgElement, msgTag.firstChild);
    console.log(msg);
}