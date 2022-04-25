// routes/index.js

const express = require('express');

// route handlers
const { health } = require('./health');
const { notFound } = require('./not-found');

const router = express.Router();

router.get('/health', health);
router.all('*', notFound);

module.exports = router;
