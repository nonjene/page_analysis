
const fs = require('fs'),
    path = require('path');

const download = require('./download');
const optimize = require('./optimize');

const mkdirs = function (dirpath, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback(dirpath);
        } else {
            mkdirs(path.dirname(dirpath), function () {
                fs.mkdir(dirpath, callback);
            });
        }
    });
};



exports.getImgReport = function (aLinks) {
    //console.log(aLink)
    var now = Date.now();
    var localOriFolder = 'public/img/ori/' + now + '/';
    var outputFolder = 'public/img/opt/' + now;
    mkdirs(localOriFolder);
    mkdirs(outputFolder);

    aLinks.forEach(link => {
        let oriFullPath = localOriFolder + path.basename(link).split('?')[0];

        download(link, oriFullPath)
            .then(() => {
                console.log('optimize run');
                return optimize([oriFullPath], outputFolder);
            })
            .then(buffer => {
                console.log('optimize done');
            });
    });

};
