const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongodb = require('mongodb')
const url = "mongodb://localhost:27017/"

router.post(`/mangaslivre`, (req, res) => {
    const data = req.body.BodyRequest
    const options = {
        method: 'POST',
        url: req.body.url,
        data
    }

    if (req.body.RequestType == 0 || req.body.RequestType == 1) {
        options["headers"] = { "X-Requested-With": "XMLHttpRequest", 'content-type': 'application/json' }
    }

    axios(options).then(response => {
        res.send(response.data)
    }).catch(err => {
        res.send('erro')
    })
})

router.post(`/saveMangaFavorito`, (req, res) => {
    const MongoClient = mongodb.MongoClient

    const collection = "mangasfavoritos", databasename = "playground";
    MongoClient.connect(url, (err, db) => {
        if (err) res.send({
            status: 500,
            resultado: err.message
        })
        let dbo = db.db(databasename);
        dbo.collection(collection).insertOne(req.body.manga, (err, result) => {
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
    })
})

router.get('/getMangasFavoritos', (req, res) => {
    const MongoClient = mongodb.MongoClient
    const collection = "mangasfavoritos", databasename = "playground";
    MongoClient.connect(url, (err, db) => {
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
})

module.exports = router;