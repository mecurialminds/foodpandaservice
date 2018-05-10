var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
var datetime = require('node-datetime')

/* GET users listing. */
router.get('/', function(req, res, next) {
    var param = url.parse(req.url, true).query;
    var incomingAction = param.incomingAction;
    var dateObj = JSON.parse(param.obj);
    var dTime = datetime.create(dateObj.tDate);
    var dformatted = dTime.format('m/d/Y H:M:S');
    var toDay = datetime.create(dateObj.tToday);
    var tformatted = toDay.format('m/d/Y H:M:S');
    var flag= "false";
    console.log(dTime._created);
    console.log(toDay._created);
    if(dformatted <= tformatted){
        res.send('{"check": "false"}');
    }else{
        res.send('{"check": "true"}');
    }
  res.send('{check:}');
});

module.exports = router;
