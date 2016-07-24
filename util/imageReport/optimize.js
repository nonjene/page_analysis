const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');


module.exports = function (aFile, outputFolder) {
    //['images/*.{jpg,png}']
    return imagemin(aFile, outputFolder, {
        plugins: [
            imageminJpegtran(),
            imageminPngquant({ quality: '65-80' })
        ]
    });
};
