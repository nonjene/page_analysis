"use strict";
var page   = require('webpage').create(),
    system = require('system'),
    t, address;
var domready = require('../domReady');

if (system.args.length === 1) {
    console.log('Usage: loadspeed.js <some URL>');
    phantom.exit(1);
} else {
    t = Date.now();
    address = system.args[1];
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } else {
            t = Date.now() - t;
            console.log('Page title is ' + page.evaluate(function () {
                    return document.title;
                }));

        }
        phantom.exit();
    });
    page.onInitialized = function () {
        domready(page, function (data) {
            console.log('Ready time ' + (data - t) + ' msec');
        })

    }


}
