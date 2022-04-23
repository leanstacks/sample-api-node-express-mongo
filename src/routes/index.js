// routes/index.js

const express = require('express');

// route handlers
const { notFound } = require('./not-found');

const router = express.Router();

router.all('*', notFound);

module.exports = router;
