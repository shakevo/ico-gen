<?php
require 'vendor/autoload.php';
use PHP_ICO\PHP_ICO;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dataURL = $_POST['image'];
    $size = intval($_POST['size']);

    // データURIから画像データをデコード
    list($type, $data) = explode(';', $dataURL);
    list(, $data) = explode(',', $data);
    $data = base64_decode($data);

    // PNGファイルとして保存
    $pngFile = 'icon.png';
    file_put_contents($pngFile, $data);

    try {
        // ICOファイルを生成
        $ico = new PHP_ICO($pngFile, array(array($size, $size)));
        $icoFile = 'icon.ico';
        $ico->save_ico($icoFile);

        // ICOファイルをクライアントに送信
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . basename($icoFile));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($icoFile));
        readfile($icoFile);

        // 一時ファイルの削除
        unlink($pngFile);
        unlink($icoFile);
        
    } catch (Exception $e) {
        // 例外はスロー(環境依存のエラーを想定 例えばphp-icoライブラリが無いなど)
        http_response_code(500);
        echo 'ICOファイルの生成に失敗しました。';
    }
}
?>
