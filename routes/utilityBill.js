var express = require('express');
var router = express.Router();
var request = require('request');
var objDB = require('../src/db');
var url = require('url');

/* GET home page. */
router.get('/', function (req, res, next) {
    doPsot(req, res, next);
});

router.post('/', function (req, res, next) {
    doPsot(req, res, next);
});

function doPsot(req, res, next) {

    if (req.method == "GET") {
        var param = url.parse(req.url, true).query;
        try {
            var payee = param.payee;

            objDB.getBill(payee, res);

        }catch
            (e) {
            console.log(e);
        }

    }
}



module.exports = router;