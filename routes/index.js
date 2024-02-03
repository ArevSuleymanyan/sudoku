const express = require('express');
const apiRoute = require('./api');
const setupPages = require('./pages');

const router = express.Router();

router.use('/api', apiRoute);
setupPages(router);
module.exports = router;
