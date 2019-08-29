const express = require('express'),
app = express();
const router = express.Router();
router.use(require('./controllers'));

app.use(router);

module.exports = app;