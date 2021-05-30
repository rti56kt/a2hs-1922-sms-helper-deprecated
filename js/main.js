if('serviceWorker' in navigator) {
    window.addEventListener('DOMContentLoaded', function() {
        navigator.serviceWorker.register('/a2hs-qrscanner/sw.js')
        .then(reg => console.log('😎 Service worker registered!', reg))
        .catch(err => console.error('😥 Service worker registration failed: ', err));
    });
}

window.addEventListener('DOMContentLoaded', function() {
    var installPromptEvent;
    var scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });

    scanner.addListener('scan', function (content) {
        $('#scanModal').modal('show');
        $('#scanModalModalContent').text(content);

        var checkurl = /^((https?|http?|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        var checksms = /^(smsto?|SMSTO?):([0-9]+):(.+\n.*)$/;

        if(checkurl.test(content)) {
            $('#scanModalPrimaryBtn').text('Redirect');
            $('#scanModalPrimaryBtn').click( function() {
                location.href = newc;
            });
            // window.open(content, '_self');
        }

        if(checksms.test(content)) {
            let phonenum = content.replace(/^(smsto?|SMSTO?):([0-9]+):(.*\n.*)$/, '$2');
            let smsbody = content.replace(/^(smsto?|SMSTO?):([0-9]+):(.+\n.*)$/, '$3');
            let newc = 'sms:' + phonenum + '?body=' + encodeURIComponent(smsbody);
            $('#scanModalPrimaryBtn').text('Open SMS App');
            $('#scanModalPrimaryBtn').click(function() {
                location.href = newc;
            });
        }
    });

    Instascan.Camera.getCameras().then(function (cameras) {
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
