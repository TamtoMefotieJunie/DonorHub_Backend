
const express = require('express');
const router = express.Router();
const packController = require('../controllers/bloodPack.controller.js');

router.post('/newpack/:id', packController.createPack);
router.get('/:id',packController.getPacksById);
router.get('/fetch/all', packController.getAllPacks);
router.get('/fetch/group', packController.getAllPacksByGroup);
router.get('/hospital/allpacks/:id', packController.getPacksByHospitalId);
router.put('/update/:id', packController.updatePacks);
router.delete('/delete/one', packController.DeletePacks);

module.exports = router;
