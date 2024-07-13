// script.js file

function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    function onScanSuccess(decodeText, decodeResult) {
        // Ensure the URL is HTTPS
        const scannedUrl = decodeText.startsWith('http://') ? decodeText.replace('http://', 'https://') : `https://${decodeText}`;

        // Show the popup with the scanned URL
        document.getElementById('popup-content').src = scannedUrl;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }

    document.getElementById('popup-close').addEventListener('click', function () {
        // Close the popup and clear the iframe src
        document.getElementById('popup-content').src = '';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
        window.location.reload();
    });
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbox: 250 }
    );
    htmlscanner.render(onScanSuccess);
});


