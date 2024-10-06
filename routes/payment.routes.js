const express = require('express')
const router = express.Router();
const paymentController = require('../controllers/payment.controller.js')

router.post('/collect',paymentController.requestPayment)
// router.post('https://demo.campay.net/api/token/',paymentController.authenticate)

module.exports = router;

