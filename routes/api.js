var express = require('express');
var router = express.Router();

var getShot = require('../phantomjs/index').getShot

/* GET users listing. */
router.post('/test', function (req, res) {
    //var {addr}  = req.body;
    getShot(req.body,function(data){
        //console.log(data)
        res.json(data)
    });
    
});

module.exports = router;