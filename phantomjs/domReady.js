var f = 0;
module.exports = function (page, onReady) {

    if (f) { return; }
    f = 1;
    // console.log('onInitialized')
    page.onCallback = function (data) {
        onReady(Date.now(), data);
    };

    page.evaluate(function () {
        var t =Date.now();
        //console.log(document.getElementsByTagName('body')[0].innerHTML)
        document.addEventListener('DOMContentLoaded', function () {
            console.log(document.documentElement.clientWidth);
            window.callPhantom({
                t:t
            });

        }, false);

    });

};


