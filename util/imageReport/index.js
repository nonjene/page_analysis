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
    return new Promise((resolve, reject)=> {
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
    const folderName = getDateHour() + (Math.random() * 1000 | 0);
    const localOriFolder = PublicFolder + 'img/ori/' + folderName + '/';
    const outputFolder = PublicFolder + 'img/opt/' + folderName + '/';

    mkdirs(localOriFolder);
    mkdirs(outputFolder);

    var aImgOptimize = aLinks.map(link => {
        const fileName = path.basename(link).split('?')[0];
        const oriFullPath = localOriFolder + fileName;
        const optFullPath = outputFolder + fileName;

        return new Promise((resolve, reject)=> {
            download(link, oriFullPath)
                .then(() => {
                    //console.log('optimize run');
                    return optimize([oriFullPath], outputFolder);
                })
                .then(buffer => {
                    console.log('optimize done');
                    return getFileSize(optFullPath);
                })
                .then(optSize=> ({
                    optSize,
                    optFullPath
                }))
                .then(info=>{
                    getFileSize(oriFullPath).then(oriSize=>resolve(
                        Object.assign({},info,{oriSize})
                    ));

                })
                .catch(e=>{
                    console.log(e);
                    resolve({
                        oriSize:0,
                        optSize:0,
                        optFullPath: null
                    })
                });
        });
    });
    Promise.all(aImgOptimize).then(aOptInfo=> {
        const allOptImgSize = aOptInfo.reduce((pre, next)=> pre + next.optSize, 0);
        const allOriImgSize = aOptInfo.reduce((pre, next)=> pre + next.oriSize, 0);
        const allOptImg = aOptInfo.reduce((pre, next)=> [next.optFullPath, ...pre], []);

        const zipName = outputFolder.slice(0, -1)+'.zip';

        zip(allOptImg, zipName, ()=> {
            return cb && cb({
                    slug: 'image',
                    desc: '图片优化度',
                    allOriImgSize,
                    allOptImgSize,
                    score: (allOptImgSize / allOriImgSize * 100) | 0,
                    zip: '/'+zipName.substr(PublicFolder.length)
                });
        })


    }).catch(e=>console.log(e));

};
