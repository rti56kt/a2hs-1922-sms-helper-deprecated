if('serviceWorker' in navigator) {
    window.addEventListener('DOMContentLoaded', function() {
        navigator.serviceWorker.register('/a2hs-qrscanner/sw.js')
        .then(reg => console.log('😎 Service worker registered!', reg))
        .catch(err => console.error('😥 Service worker registration failed: ', err));
    });
}

window.addEventListener('DOMContentLoaded', function() {
    console.log(navigator.userAgent);
    var installPromptEvent;
    var scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });

    scanner.addListener('scan', function(content) {
        $('#scanModalMainBtn').off();

        var checksms = /^(smsto?|SMSTO?):([0-9]+):(.+[\n]*.*)$/;

        if(checksms.test(content)) {
            let phonenum = null;
            let smsbody = null;
            let newcontent = null;

            phonenum = content.replace(/^(smsto?|SMSTO?):([0-9]+):(.+[\n]*.*)$/, '$2');
            smsbody = content.replace(/^(smsto?|SMSTO?):([0-9]+):(.+[\n]*.*)$/, '$3');
            newcontent = 'sms:' + phonenum + ';?&body=' + encodeURIComponent(smsbody);

            if(phonenum === "1922") {
                $('#scanModalContent').text(content);
                $('#scanModalMainBtn').addClass('btn-primary');
                $('#scanModalMainBtn').text('打開簡訊App');
                $('#scanModalMainBtn').click(function() {
                    location.href = newcontent;
                });
                $('#scanModal').modal('show');
            } else {
                $('#scanModalContent').html('<div class="alert alert-danger" role="alert">⚠此則簡訊收件人並非1922，發送此簡訊可能會被收費。<br><span class="fs-6">如您認為這是誤報，您仍可點擊底下的"打開簡訊App"按鈕以傳送簡訊。</span></div>' + content);
                $('#scanModalMainBtn').addClass('btn-danger');
                $('#scanModalMainBtn').text('打開簡訊App');
                $('#scanModalMainBtn').click(function() {
                    location.href = newcontent;
                });
                $('#scanModal').modal('show');
            }
        }
    });

    Instascan.Camera.getCameras().then(function(cameras) {
        if(cameras.length > 1) {
            scanner.start(cameras[1]);
        } else if(cameras.length === 1) {
            scanner.start(cameras[0]);
        } else {
            console.error('😥 No Camera found.');
        }
    }).catch(err => console.error('😥 Something went wrong: ', err));

    window.addEventListener('beforeinstallprompt', function(event) {
        event.preventDefault();
        installPromptEvent = event;
        $('#downloadBtn').removeClass('d-none');
        $('#downloadBtn').removeAttr('disabled');
    });

    window.addEventListener('appinstalled', function(event) {
        $('#downloadBtn').addClass('d-none');
    });

    $('#downloadBtn').click(function() {
        $('#downloadBtn').attr('disabled', '');
        if(installPromptEvent) {
            installPromptEvent.prompt();
            installPromptEvent = null;
        }
    });

    $('#infoBtn').click(function() {
        $('#infoModal').modal('show');
    });
});
