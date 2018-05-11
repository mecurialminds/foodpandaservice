var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
var datetime = require('node-datetime')

/* GET users listing. */
router.get('/', function(req, res, next) {
    var param = url.parse(req.url, true).query;
    var incomingAction = param.incomingAction;

    var dTime = datetime.create(param.delDate + " " + param.delTime);
    var dformatted = dTime.format('m/d/Y H:M:S');
    var toDay = datetime.create(param.todayDate + " " + param.todayTime);
    var tformatted = toDay.format('m/d/Y H:M:S');
    var flag= "false";
    console.log(dTime._created);
    console.log(toDay._created);
    res.setHeader('Content-Type', 'application/json');
    if(dformatted == tformatted){
        return res.json({check: "equal"});
    }else if(dformatted > tformatted){
        return res.json({check: "false"});
    }else{
        return res.json({check: "true"});
    }
  res.send('{check:}');
});

module.exports = router;
