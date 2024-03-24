const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let jobsProxyController = require('../controller/jobs-backend.controller');

router.all('/jobs*', jobsProxyController.proxyApi);

module.exports = router;
