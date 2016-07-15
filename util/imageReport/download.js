const request = require('request');
const fs = require('fs');

module.exports = function (uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', function () {
                resolve();
            });
        });
    });
};


/*download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function () {
    console.log('done');
});
*/