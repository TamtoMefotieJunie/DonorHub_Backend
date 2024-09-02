
const express = require('express');
const router = express.Router();
const packController = require('../controllers/bloodPack.controller.js');

router.post('/newpack/:uid', packController.createPack);
router.post('/getAll', packController.getAllPacks);
router.post('/group', packController.getAllPacksByGroup);
router.post('/update', packController.updatePacks);
router.post('/delete', packController.DeletePacks);

module.exports = router;
