var shell = require('../util/shell');
var fs = require('fs');

shell
    .run('phantomjs confess/confess.js https://www.baidu.com performance')

    .then(stdout=>{
        fs.writeFile('./confess.txt',stdout)
    })
    .catch(err=>console.log(err));
