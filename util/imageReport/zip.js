/*
 *
 const fs = require('fs');
 var JSZip = require("jszip");


 module.exports = function (folder, cb) {
 var zipFullPath = folder.replace(/\/$/, '') + '.zip';
 var zip = new JSZip();
 zip.folder(folder);
 // this call will create photos/README
 //zip.file("README", "a folder with photos");

 zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
 .pipe(fs.createWriteStream(zipFullPath))
 .on('finish', function () {
 // JSZip generates a readable stream with a "end" event,
 // but is piped here in a writable stream which emits a "finish" event.
 console.log("out.zip written.");
 cb(zipFullPath);
 });
 };
 *
 * */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

module.exports = function (aFiles, saveAs, cb) {
    const output = fs.createWriteStream(saveAs);

    const archive = archiver('zip');

    output.on('close', function () {
        console.log('zip done!');
        return cb && cb();
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    aFiles
        .reduce((archive, file)=>{
            if(!file) return archive;
            
            return archive.append(fs.createReadStream(file), {
                name: path.basename(file)
            })
        }, archive)
        .finalize();

};