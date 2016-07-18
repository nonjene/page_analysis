var shell = require('../util/shell');
var fs = require('fs');

shell
    .run('phantomjs ../phantomjs/sample/loadspeed.js https://www.baidu.com')

    .then(stdout=>{
        console.log(stdout)
    })
    .catch(err=>console.log(err));
