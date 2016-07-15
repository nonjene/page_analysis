/**
 * Created by Nonjene on 16/7/13.
 */
var shell = require('../util/shell');
var fs = require('fs');
var getImgReport = require('../util/imageReport/').getImgReport;

const rImg = /png|jpg|gif|jpeg/;

exports.getShot = function (data, cb) {
    var arg = [data.addr, data.device].join(' ');
    shell
        .run('phantomjs phantomjs/firstScreen.js ' + arg)
        .then(stdout => {
            let outData = JSON.parse(stdout);
            outData.analysis = [];
            return outData;
        })
        .then(outData => {
            //Optimize images
            let out = getImgReport(outData.summary.list.reduce((prev, next) => {
                if (!next) { return prev; }
                if (rImg.test(next.type)) {
                    //很小的图片忽略
                    if (next.size < 1) {
                        return prev;
                    }
                    return [next.url, ...prev];

                } else {
                    return prev;
                }
            }, []));
            outData.analysis.push(out);
            return outData;
        })
        .then(outData => {
            cb(outData);
            return outData;
        })
        .then(outData => {
            fs.writeFile('./public/build/result_' + Date.now() + '.txt', JSON.stringify(outData));
            return outData;
        })
        .catch(err => console.log(err));
};
