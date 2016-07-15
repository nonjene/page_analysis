const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');


module.exports = function (aFile, outputFolder) {
    //['images/*.{jpg,png}']
    return imagemin(aFile, outputFolder, {
        plugins: [
            imageminMozjpeg({ targa: true }),
            imageminPngquant({ quality: '65-80' })
        ]
    });
};
