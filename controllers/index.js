const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.use('/api',require('./mangaslivre/mangaslivres'));
router.use('/api',require('./youtube/youtube'));
router.use('/api', require('./study/main'));

module.exports = router;