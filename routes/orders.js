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
    if(req.method == "GET"){
        var param = url.parse(req.url, true).query;
        var incomingAction = param.incomingAction;

        if (incomingAction == null) {
            res.send({err: "action is null"});
        }
        if (incomingAction == "") {
            res.send({err: "action is empty"});
        }
        try {
            if (incomingAction == "find") {
                var cid = param.cid;
                var oid = param.oid;

                if (cid != null && cid != undefined) {
                    try {
                        cid = Number(cid);
                    } catch (e) {

                    }
                }
                if (oid != null && oid != undefined) {
                    try {
                        oid = Number(oid);
                    } catch (e) {

                    }
                }
                objDB.getOrder(oid, cid, res);
                /*
                else {
                    res.send({err: "Customer and Order are empty"});
                }
        */

            }else {
                var objOrder = JSON.parse(param.obj);
                objOrder.id = parseInt(objOrder.id);
                if (incomingAction == "add") {
                    objDB.insertOrder(objOrder, res)
                } else if (incomingAction == "update") {
                    objDB.updateOrder(objOrder, res)
                }
            }
        }

        catch
            (e) {
            console.log(e);
        }


    }else {
        var incomingAction = req.body.incomingAction;
        var objOrder = req.body.order;

        if (incomingAction == null) {
            res.send({err: "action is null"});
        }
        if (incomingAction == "") {
            res.send({err: "action is empty"});
        }
        /*if (objOustomer == null) {
            res.send({err: "customer is null"});
        }
        if (objOustomer == "") {
            res.send({err: "customer is empty"});
        }
    */
        try {
            if (incomingAction == "add") {
                objDB.insertOrder(objOrder, res)
            } else if (incomingAction == "update") {
                objDB.updateOrder(objOrder, res)
            } else if (incomingAction == "find") {
                var cid = req.body.cid;
                var oid = req.body.oid;

                if (cid != null && cid != undefined) {
                    try {
                        cid = Number(cid);
                    } catch (e) {

                    }
                }
                if (oid != null && oid != undefined) {
                    try {
                        oid = Number(oid);
                    } catch (e) {

                    }
                }
                objDB.getOrder(oid, cid, res);
                /*
                else {
                    res.send({err: "Customer and Order are empty"});
                }
        */

            }
        }

        catch
            (e) {
            console.log(e);
        }
    }

}

module.exports = router;
