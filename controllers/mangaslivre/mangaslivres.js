const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongodb = require('mongodb')

router.post(`/mangaslivre`, (req,res) => {
    const data = req.body.BodyRequest
    const options = {
        method:'POST',
        url:req.body.url,
        data
   }

    if(req.body.RequestType == 0 || req.body.RequestType == 1){
         options["headers"] = { "X-Requested-With" : "XMLHttpRequest", 'content-type' : 'application/json' }
    }

   axios(options).then(response => {
       res.send(response.data)
   }).catch(err => {
       res.send('erro')
   })
})

module.exports = router;