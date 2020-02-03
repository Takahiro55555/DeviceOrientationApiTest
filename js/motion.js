//ジャイロセンサー確認
let isGyro = false;
if ((window.DeviceOrientationEvent) && ('ontouchstart' in window)) {
    isGyro = true;
}

//PCなど非ジャイロ
if (!isGyro) {
    gyroIsNotAllowed();

    //一応ジャイロ持ちデバイス
} else {
    //ジャイロ動作確認
    let resGyro = false;
    window.addEventListener("deviceorientation", doGyro, false);
    function doGyro() {
        resGyro = true;
        window.removeEventListener("deviceorientation", doGyro, false);
    }

    //数秒後に判定
    setTimeout(function () {
        //ジャイロが動いた
        if (resGyro) {
            gyroIsNotAllowed();

            //ジャイロ持ってるくせに動かなかった
        } else {
            //iOS13+方式ならクリックイベントを要求
            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                //ユーザアクションを得るための要素を表示
                cv._start.show();
                cv._start.on("click", function () {
                    cv._start.hide();
                    DeviceOrientationEvent.requestPermission().then(res => {
                        //「動作と方向」が許可された
                        if (res === "granted") {
                            gyroIsNotAllowed();
                            //「動作と方向」が許可されなかった
                        } else {
                            isGyro = false;
                            gyroIsNotAllowed();
                        }
                    });
                });

                //iOS13+じゃない
            } else {
                //早くアップデートしてもらうのを祈りながら諦める
                isGyro = false;
                gyroIsNotAllowed();
            }
        }
    }, 300);
}

function gyroIsAllowed() {
    msg = "[OK]ジャイロセンサーが利用可能になりました";
    const msgTag = document.getElementById("msg");
    msgTag.innerText = msg;
    console.log(msg);
}

function gyroIsNotAllowed() {
    msg = "[ERROR]ジャイロセンサーが利用できません";
    const msgTag = document.getElementById("msg");
    msgTag.innerText = msg;
    console.log(msg);
}