const express = require('express');
const router = express.Router();
const multer = require('multer');

let backboneProxyController = require('../controller/backbone.controller');

router.all('/backbone/api*', backboneProxyController.proxyApi);

module.exports = router;
