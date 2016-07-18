const fs = require('fs');

const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/example-output.zip');
const archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

var file1 = __dirname + '/zip.js';

archive
    .append(fs.createReadStream(file1), {name: 'zip.js'})
    .append(fs.createReadStream(file1), {name: 'zip2.js'})
    .finalize();