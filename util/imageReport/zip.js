/**
 * Created by Nonjene on 16/7/18.
 */
const fs = require('fs');
var JSZip = require("jszip");


module.exports = function(folder,cb){
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