const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;


const dbConnectionString = "mongodb://bot:bot@ds014648.mlab.com:14648/foodpandabot";
const dbName = "foodpandabot";
const customersCollection = "customers";
const orderCollection = "orders";

function getNextSequenceValue(sequenceName) {
    MongoClient.connect(dbConnectionString, function (err, db) {

        var query = {'_id': sequenceName};
        var sort = [];
        var operator = {'$inc': {sequence_value: 1}};
        var options = {'new': true};
        var sequenceDocument = db.db(dbName).collection("counters").findAndModify(query, sort, operator, options, function (err, doc) {
            try {
                if (err) console.log(err);
                if (!doc) console.log("No Counter Found!");
                else console.log(doc.value._id + " = " + doc.value.sequence_value);
            } finally {
                db.close();
            }
        });
    });
}

module.exports.insertCustomer = function insertCustomer(customer, response) {

    MongoClient.connect(dbConnectionString, function (err, db) {

        try {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("counters").findOne({_id: 'cid'}, function (err, result) {
                if (err) throw err;
                MongoClient.connect(dbConnectionString, function (err, db) {
                    try {
                        if (err) throw err;
                        var dbo = db.db(dbName);
                        var objCustomer = {}
                        objCustomer.customer = JSON.parse(customer);
                        objCustomer.customer.id = result.sequence_value;
                        dbo.collection(customersCollection).insertOne(objCustomer, function (err, res) {
                            if (err) throw err;
                            console.log("1 customer inserted");
                            var re = {status: 'success'};
                            response.send(re);

                        });
                    } finally {
                        db.close();
                    }
                });

                getNextSequenceValue("cid");
            });
        } catch (e) {
            db.close();
        }
    });
}


module.exports.updateCustomer = function updateCustomer(customer, response) {

    MongoClient.connect(dbConnectionString, function (err, db) {
            var objCustomer = JSON.parse(customer);
            var query = {"customer.id":objCustomer.id};
            var sort = [];
            var operator = {$set: {customer: objCustomer}};//{'customer': objCustomer};
            var options = {new: true, setDefaultsOnInsert: true};//{'new': true, 'update':true};
            var sequenceDocument = db.db(dbName).collection("customers").findOneAndUpdate(query, operator, options, function (err, doc) {
                try {
                    if (err) {
                        console.log(err);
                        var re = {status: 'Fail', error: err};
                        response.send(re);
                    }
                    if (!doc) {
                        console.log("No Counter Found!");
                        var re = {status: 'Fail', error: 'No Object Found With id = ' + customer.id};
                        response.send(re);
                    }

                    else {
                        console.log(doc.value.customer.id + " has been updated");
                        var re = {status: 'success'};
                        response.  send(re);
                        console.log("doc = "+ doc);
                    }
                } finally {
                    db.close();
                }
            });
        }
    );
}

module.exports.getCustomer = function getCustomer(email, phone, response) {
    MongoClient.connect(dbConnectionString, function (err, db) {
        try {
            if (err) throw err;
            var dbo = db.db(dbName); //{$or: [{'customer.email': email},{'customer.phone': phone}]} {'customer.email': email}
            dbo.collection("customers").findOne({$or: [{'customer.email': email},{'customer.phone': phone}]}, function (err, result) {
                if (err) throw err;

                if (result != null) {
                    response.send(result);
                }
                else {
                    response.send({err:'No result found'});
                }


            });
        } catch (e) {
            db.close();
        }
    });
}

//---------------------------------------------------------------orders----------------------------------------------------

module.exports.insertOrder = function insertOrder(order, response) {

    MongoClient.connect(dbConnectionString, function (err, db) {

        try {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("counters").findOne({_id: 'oid'}, function (err, result) {
                if (err) throw err;
                MongoClient.connect(dbConnectionString, function (err, db) {
                    try {
                        if (err) throw err;
                        var dbo = db.db(dbName);
                        var objOrder = {}
                        try {
                            objOrder.order = JSON.parse(order);
                        } catch (e) {
                            response.send("{err: object cant be parsed (invalid arguments)}");
                        }
                        objOrder.order.id = result.sequence_value;
                        dbo.collection(orderCollection).insertOne(objOrder, function (err, res) {
                            if (err) throw err;
                            console.log("1 order inserted");
                            var re = {status: 'success'};
                            response.send(re);

                        });
                    } finally {
                        db.close();
                    }
                });

                getNextSequenceValue("oid");
            });
        } catch (e) {
            db.close();
        }
    });
}


module.exports.updateOrder = function updateOrder(order, response) {

    MongoClient.connect(dbConnectionString, function (err, db) {
            var objOrder = JSON.parse(order);
            var query = {"order.id":objOrder.id};
            var sort = [];
            var operator = {$set: {order: objOrder}};
            var options = {new: false, setDefaultsOnInsert: true};
            var sequenceDocument = db.db(dbName).collection(orderCollection).findOneAndUpdate(query, operator, options, function (err, doc) {
                try {
                    if (err) {
                        console.log(err);
                        var re = {status: 'Fail', error: err};
                        response.send(re);
                    }
                    if (!doc) {
                        console.log("No Counter Found!");
                        var re = {status: 'Fail', error: 'No Object Found With id = ' + order.id};
                        response.send(re);
                    }

                    else {
                        console.log(doc.value.order.id + " has been updated");
                        var re = {status: 'success'};
                       console.log("doc = "+ doc);
                    }
                } finally {
                    db.close();
                }
            });
        }
    );
}

module.exports.getOrder = function getOrder(oid, cid, response) {
    MongoClient.connect(dbConnectionString, function (err, db) {
        try {
            if (err) throw err;
            var dbo = db.db(dbName);
            query = {}//{$or: [{'order.id': oid},{'order.customerId': cid}]};
            if(oid != null && cid != null && cid != undefined && oid != undefined)
            {
                query={$and: [{'order.id': oid},{'order.customerId': cid}]};
            }
            else if(cid != null && cid != undefined){
                query = {'order.customerId': cid};
            } else if(oid != null && oid != undefined){
                query = {'order.id': oid};
            }
            dbo.collection(orderCollection).find(query).toArray(function (err, result) {
                if (err) throw err;

                if (result != null) {
                    response.send(result);
                }
                else {
                    response.send({err:'No result found'});
                }


            });
        } catch (e) {
            db.close();
        }
    });
}

