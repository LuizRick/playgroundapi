const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongodb = require('mongodb');
const Jikan = require('jikan-node');
const url = "mongodb://localhost:27017/"


const collectionSaved = (err, result) => {
    if (err) this.res.send({
        status: 500,
        resultado: err.message
    })
    else this.res.send({
        status: 200,
        resultado: result
    })
}


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


router.post('/saveCollection', (req, res) => {
    const MongoClient = mongodb.MongoClient
    const collection = req.body.collection, databasename = "playground"
    MongoClient.connect(url, (err, db) => {
        if (err) res.send({
            status: 500,
            resultado: err.message
        })
        let dbo = db.db(databasename);
        if (Array.isArray(req.body.payload))
            dbo.collection(collection).insertMany(req.body.payload, collectionSaved.bind(this));
        else
            dbo.collection(collection).insertOne(req.body.payload, collectionSaved.bind(this));
    })
})

router.get('/myanimelist', (req, res) => {
    const mal = new Jikan();
    mal.findAnime('11597', 'episodes',1)
    .then((info) => res.send(info))
    .catch((err) => res.send(err));
});

router.get('/mal-findbyName', (req, res) => {
    const mal = new Jikan();
    mal.search('anime', req.query.name,{page: 1})
    .then((info) => res.send(info))
    .catch((err) => res.send(err));
});


router.get('/mal-season', (req, res) => {
    const mal = new Jikan();
    mal.findSeason(req.query.season, req.query.year)
    .then((info) => res.send(info))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;