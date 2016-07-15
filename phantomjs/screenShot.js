

module.exports = function (page, DiffTime, fileName, renderOneCB, allDoneCB) {
    fileName = fileName || 'pic/pic_';
    DiffTime = DiffTime || [0, 500, 1000, 1500, 2000, 2500, 3000, 5000];

    var shot = function (count) {
        count = count || 0;
        setTimeout(function () {
            var _fileName = fileName + DiffTime[count] + '_' +(Math.random() * 1e3 | 0) + '.jpg';
            if (count > DiffTime.length - 1) {
                return allDoneCB && allDoneCB();
            }
            //console.log(_fileName);

            page.render('public/' + _fileName, { format: 'jpg', quality: '60' });
            renderOneCB && renderOneCB({
                addr: _fileName,
                time: DiffTime[count]
            });

            return shot(count + 1);
        }, DiffTime[count]);
    };
    shot();
};