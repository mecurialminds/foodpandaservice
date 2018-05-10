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
                var email = param.email;
                var phone = param.phone;

                //email= email== null?'':email;
                //phone= phone== null?'':phone;
                /* if (email != null)
                 {
                     objDB.getCustomerByEmail(email,res)
                 }else if (phone != null){
                     objDB.getCustomerByPhone(email,res)
                 }*/
                if (email != null || phone != null) {
                    objDB.getCustomer(email, phone, res);
                }
                else {
                    res.send({err: "Email and Phone are empty"});
                }


            }else {
                var objOustomer = {id: param.id, name: param.name, email: param.email, phone: param.phone};
                if (incomingAction == "update") {
                    objDB.updateCustomer(objOustomer, res)
                } else if (incomingAction == "add") {
                    objDB.insertCustomer(objOustomer, res)
                }
            }
        } catch (e) {
            console.log(e);
        }

    }else {


        var incomingAction = req.body.incomingAction;
        var objOustomer = req.body.customer;

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
                objDB.insertCustomer(objOustomer, res)
            } else if (incomingAction == "update") {
                objDB.updateCustomer(objOustomer, res)
            } else if (incomingAction == "find") {
                var email = req.body.email;
                var phone = req.body.phone;

                //email= email== null?'':email;
                //phone= phone== null?'':phone;
                /* if (email != null)
                 {
                     objDB.getCustomerByEmail(email,res)
                 }else if (phone != null){
                     objDB.getCustomerByPhone(email,res)
                 }*/
                if (email != null || phone != null) {
                    objDB.getCustomer(email, phone, res);
                }
                else {
                    res.send({err: "Email and Phone are empty"});
                }


            }
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = router;
