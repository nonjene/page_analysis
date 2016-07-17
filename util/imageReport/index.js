const fs   = require('fs'),
      path = require('path');

const download = require('./download');
const optimize = require('./optimize');
const zip = require('./zip');

const PublicFolder = 'public/';

const mkdirs = function (dirpath, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback && callback(dirpath);
        } else {
            mkdirs(path.dirname(dirpath), function () {
                fs.mkdir(dirpath, callback);
            });
        }
    });
};
const getDateHour = function () {
    return (new Date()).toISOString().split(':')[0];
};
const getFileSize = function (file) {
    return Promise((resolve, reject)=> {
        fs.stat(file, (err, stats)=> {
            if (err !== null) {
                return reject(err);
            }
            //Convert file size to KB
            resolve(stats["size"] / 1000.0 | 0);
        })
    });
};


exports.getImgReport = function (aLinks, cb) {
    //console.log(aLink)
    var folderName = getDateHour() + (Math.random() * 1000 | 0);
    var localOriFolder = PublicFolder + 'img/ori/' + folderName + '/';
    var outputFolder = PublicFolder + 'img/opt/' + folderName + '/';
    var allOriImgSize = 0,
        allOptImgSize = 0;

    mkdirs(localOriFolder);
    mkdirs(outputFolder);

    var aImgOptimize = aLinks.map(link => {
        let fileName = path.basename(link).split('?')[0];
        let oriFullPath = localOriFolder + fileName;
        return new Promise((resolve, reject)=> {
            download(link, oriFullPath)
                .then(() => {
                    getFileSize(oriFullPath).then(size=>allOriImgSize += size);
                })
                .then(() => {
                    //console.log('optimize run');
                    return optimize([oriFullPath], outputFolder);
                })
                .then(buffer => {
                    console.log('optimize done');
                    return getFileSize(outputFolder + fileName);
                })
                .then(size=> resolve(size))
                .catch(e=>reject(e));
        });
    });
    Promise.all(aImgOptimize).then(aOptSizes=> {
        allOptImgSize = aOptSizes.reduce((pre, next)=> pre + next);

        zip(outputFolder, zipFullPath=> {
            return cb && cb({
                    allOriImgSize,
                    allOptImgSize,
                    score: allOptImgSize / allOriImgSize,
                    zip: zipFullPath.substr(PublicFolder.length)
                });
        })


    })

};
