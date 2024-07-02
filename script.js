document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate');
    const downloadICOButton = document.getElementById('download-ico');
    const downloadPNGButton = document.getElementById('download-png');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // プレビュー生成ボタンのクリックイベント
    generateButton.addEventListener('click', function() {
        const size = parseInt(document.getElementById('size').value);
        canvas.width = size;
        canvas.height = size;
        const blockSize = Math.max(4, Math.floor(size / 4)); // Increase block size for larger color blocks
        for (let y = 0; y < size; y += blockSize) {
            for (let x = 0; x < size; x += blockSize) {
                const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
        downloadICOButton.disabled = false;
        downloadPNGButton.disabled = false;
    });

    // ICOダウンロードボタンのクリックイベント
    downloadICOButton.addEventListener('click', function() {
        downloadImage('ico');
    });

    // PNGダウンロードボタンのクリックイベント
    downloadPNGButton.addEventListener('click', function() {
        const dataURL = canvas.toDataURL('image/png');
        downloadFile(dataURL, 'icon.png');
    });

    // 画像をダウンロードするための関数
    function downloadImage(format) {
        const size = parseInt(document.getElementById('size').value);
        const dataURL = canvas.toDataURL('image/png');
        const formData = new FormData();
        formData.append('image', dataURL);
        formData.append('size', size);

        fetch('generate.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate ICO file.');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const extension = format === 'ico' ? 'ico' : 'png';
            downloadFile(url, `icon_${size}x${size}.${extension}`);
        })
        .catch(() => alert('ICOファイルの生成に失敗しました。'));
    }

    // ファイルダウンロードのヘルパー
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
});
