const express = require('express')
const router = express.Router();
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/"
const collection = "timetable", databasename = "playground";

router.post('/save-subject', (req, res) => {
    const MongoCliente = mongodb.MongoClient;
    MongoCliente.connect(url, (err, db) => {
        if (err) res.render({
            status: 500,
            resultado: err.message
        })

        let dbo = db.db(databasename);

        dbo.collection(collection).insertOne(req.body, (err, result) => {
            if (err) res.send({
                status: 500,
                resultado: err.message
            })
            else res.send({
                status: 200,
                resultado: result.insertedCount
            })
        })
        db.close();
    });
});


router.get('/get-subjects', (req, res) => {
    const MongoCliente = mongodb.MongoClient;
    MongoCliente.connect(url, (err, db) => {
        if (err) res.send({
            status: 500,
            resultado: err.message
        })
        let dbo = db.db(databasename);
        dbo.collection(collection).find({}).toArray((err, result) => {
            if (err) res.send({
                status: 500,
                resultado: err.message
            })
            else res.send({
                status: 200,
                resultado: result
            })
        })
        db.close();
    });
});

router.post('/update-subject', (req, res) => {
    const MongoCliente = mongodb.MongoClient;
    MongoCliente.connect(url, (err, db) => {
        if (err) res.render({
            status: 500,
            resultado: err.message
        })

        let dbo = db.db(databasename);
        let myQuery = { "_id": ObjectId(req.body["_id"]) }
        delete req.body["_id"];
        let newValues = { $set: req.body };
        dbo.collection(collection).updateOne(myQuery, newValues, (err, result) => {
            if (err) res.send({
                status: 500,
                resultado: err.message
            })
            else res.send({
                status: 200,
                resultado: result.upsertedCount
            })
        })
        db.close();
    });
})


module.exports = router;