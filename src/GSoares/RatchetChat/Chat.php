<?php
namespace GSoares\RatchetChat;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // 新しい接続を保存して、後でメッセージを送信する
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $this->writing_csv($msg);

        $numRecv = count($this->clients) - 1;

        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // 送信者は受信者ではなく、接続されている各クライアントに送信します
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // 接続が閉じられているので、メッセージを送信できなくなります
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    //ファイル書き込み
    private function writing_csv($message){
      $message = str_replace("\n", "", $message);

      $fp = fopen('C:\xampp\htdocs\chat\data\data.csv', 'a+b');

      if($fp){
        fputcsv($fp, explode(',', $message));
        fclose($fp);

        echo "Success write file\n";
      }else{
        echo "Error open file\n";
      }
    }
}
