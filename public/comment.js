// websoketオープン
var pas = "localhost";

var conn = new WebSocket('ws://' + pas + ':8080');
var name;     // ユーザーネーム
var user_json = {
    "name": undefined,
    "message": undefined
};  // ユーザーの基本情報

loadCSV("../data/data.csv");

conn.onopen = function (e) {
    console.log("Connection established!");

    //クッキー情報の読み込み
    (document.cookie.split(';')).forEach(function (value) {
        //cookie名と値に分ける
        name = (value.split('='))[1];

        document.getElementById('name_print').innerHTML = "ユーザーネーム：" + name;

        user_json.name = name;
    });
};

//テキストエリアにて値が入力、Enterが押された時に発火するイベント
function sendMessage(e) {   //キーコードを取得
    var code = (e.keyCode ? e.keyCode : e.which);
    //Enterの投下
    if (code !== 13) {
        return;
    }

    var content = document.getElementById('chat').innerHTML;

    //JSONデータを作成
    user_json.message = document.getElementById('comment_area').value;

    if (user_json.message.length === 0) {
        return;
    }
    //メッセージをコンソールに渡す
    conn.send(JSON.stringify(user_json));

    //初期化＋chat欄に書き込み
    document.getElementById('chat').innerHTML = '<div class=\"client\">'
        + '<span class=\"client_name\">' + user_json.name + '</span>'
        + '<p>' + user_json.message + '</p>'
        + '</div>'
        + '<div class=\"bms_clear\"></div>'
        + content;

    document.getElementById('comment_area').value = '';
};

//相手からメッセージが送られてきたときに発火するイベント
conn.onmessage = function (e) {
    console.log(e.data);

    var content = document.getElementById('chat').innerHTML;

    e = JSON.parse(e.data);

    //初期化＋chat欄に書き込み
    document.getElementById('chat').innerHTML = '<div class=\"user\">'
        + '<span class=\"user_name\">' + e.name + '</span>'
        + '<p>' + e.message + '</p>'
        + '</div>'
        + '<div class=\"bms_clear\"></div>'
        + content;
};

function loadCSV(targetFile) {

    // 読み込んだデータを1行ずつ格納する配列
    var allData = [];

    // XMLHttpRequestの用意
    var request = new XMLHttpRequest();
    request.open("get", targetFile, false);
    request.send(null);

    // 読み込んだCSVデータ
    var csvData = request.responseText;

    // CSVの全行を取得
    var lines = csvData.split("\n");

    //1行ずつ書き込み
    for (var i = 0; i < lines.length - 1; i++) {
        var card_data = lines[i].split(",");

        var content = document.getElementById('chat').innerHTML;

        //初期化＋chat欄に書き込み
        document.getElementById('chat').innerHTML = '<div class=\"user\">'
            + '<span class=\"user_name\">' + card_data[1] + '</span>'
            + '<p>' + card_data[0] + '</p>'
            + '</div>'
            + '<div class=\"bms_clear\"></div>'
            + content;
    }
}
