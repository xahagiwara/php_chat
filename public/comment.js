//websoketオープン
var pas = "localhost";

var conn = new WebSocket('ws://' + pas + ':8080');
var name;     //ユーザーネーム

loadCSV("../data/data.csv");

conn.onopen = function(e)
{
    console.log("Connection established!");

    //クッキー情報の読み込み
    (document.cookie.split(';')).forEach(function(value) {
        //cookie名と値に分ける
        name = (value.split('='))[1];

        document.getElementById('name_print').innerHTML = "ユーザーネーム：" + name;
    })
};

//テキストエリアにて値が入力、Enterが押された時に発火するイベント
function sendMessage(e)
{   //キーコードを取得
    var code = (e.keyCode ? e.keyCode : e.which);
    //Enterの投下
    if(code !== 13) {
        return;
    }

    //HTMLidmessageのIDを返す
    var message = escape(document.getElementById('comment_area').value) + "," + escape(name);

    var mes = message.split(",");

    if (mes[0].length == 0) {
        return;
    }
    //メッセージをコンソールに渡す
    conn.send(message);

    //divのid:chatの取得
    var content = document.getElementById('chat').innerHTML;

    //初期化＋chat欄に書き込み
    document.getElementById('chat').innerHTML = '<div class=\"client\">'
              + '<span class=\"client_name\">' + mes[1] + '</span>'
              + '<p>' + mes[0] + '</p>'
              + '</div>'
              + '<div class=\"bms_clear\"></div>'
              + content;

    document.getElementById('comment_area').value = '';
};

//相手からのメッセージをHTMLに書き込み
function receiveMessage(e)
{
    var commnet = e.data.split(",");

    var content = document.getElementById('chat').innerHTML;

    //初期化＋chat欄に書き込み
    document.getElementById('chat').innerHTML = '<div class=\"user\">'
              + '<span class=\"user_name\">' + commnet[1] + '</span>'
              + '<p>' + commnet[0] + '</p>'
              + '</div>'
              + '<div class=\"bms_clear\"></div>'
              + content;
};

//相手からメッセージが送られてきたときに発火するイベント
conn.onmessage = function(e)
{
    receiveMessage(e);
};

//エスケープ処理関数
function escape(str) {
   str = str.replace(/&/g, '&amp;');
   str = str.replace(/</g, '&lt;');
   str = str.replace(/>/g, '&gt;');
   str = str.replace(/"/g, '&quot;');
   str = str.replace(/'/g, '&#39;');
   str = str.replace(/,/g, '&#x2c;');
   return str;
}

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
