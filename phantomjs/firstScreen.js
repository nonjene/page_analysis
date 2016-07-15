'use strict';
var events = require('events');
var event = new events();

var system = require('system');

var page = require('webpage').create();

var domReady = require('./domReady');
var screenShot = require('./screenShot');

var summary = require('./reduce/summary')(page, event);

var _Data = require('./data');
var option = _Data.def;
var startTime;
var oHar = {
    DOMContentLoaded: -1,
    aPicName: []
};
var _onLoadFinished = false;


var fPushPicInfo = function (o, baseTime) {
    oHar.aPicName.push({
        addr: o.addr,
        time: baseTime + o.time
    });
};
var _debug = function (m) {
    //console.log(m)
};
var _exit = function () {
    console.log(JSON.stringify(oHar, undefined, 4));
    phantom.exit();
};

if (system.args.length === 1) {
    console.log('Usage:phantomjs firstScreen.js <some URL> <device>');
    _exit();
} else {
    option.addr = system.args[1];
    option.device = system.args[2];
}


page.viewportSize = _Data.size[option.device];
page.settings.userAgent = _Data.ua[option.device];
page.clearMemoryCache();

// page.onConsoleMessage = function (msg, lineNum, sourceId) {
//     //console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
// };
page.onError = function (msg, trace) {
    return false;
};

page.onLoadStarted = function () {
    startTime = Date.now();
    screenShot(page, [1000, 1500, 2000, 3000], 'pic/start_', function (picName) {
        fPushPicInfo(picName, 0);

    });
    event.emit('onLoadStarted',startTime);
};
page.onLoadFinished = function (status) {
    oHar.onLoaded = Date.now() - startTime;
    _debug('on loaded:' + oHar.onLoaded + 'ms');
    
    event.emit('onLoadFinished', status,function(data){
        oHar.summary = data;
    });

    screenShot(page, [0], 'pic/load_', function (picName) {
        fPushPicInfo(picName, oHar.onLoaded);

    },_exit);
    

};
page.onInitialized = function () {
    var sonInitialized = Date.now();//这个居然比onLoadStarted还短，文档没说清
    domReady(page, function (t, data) {
        _debug('DOMContentLoaded_onInitialized:' + (t - sonInitialized) + 'ms');
        _debug('DOMContentLoaded_evaluate:' + (t - data.t) + 'ms');
        _debug('DOMContentLoaded_onLoadStarted:' + (t - startTime) + 'ms');

        oHar.DOMContentLoaded = t - startTime;

        //console.log(data)

        screenShot(page, [0, 200, 400, 600, 1000, 1500], 'pic/ready_', function (picName) {
            fPushPicInfo(picName, oHar.DOMContentLoaded);

        });
    });

};
page.onResourceRequested = function (request) {
    event.emit('onResourceRequested', request);
};

page.onResourceReceived = function (response) {
    event.emit('onResourceReceived', response);
};
page.open(option.addr, function (status) {

    // _exit();
});
