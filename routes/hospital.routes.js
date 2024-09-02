const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller.js');

router.post('/addHospital', hospitalController.createHospital);
router.post('/allHospital', hospitalController.getAllHospitals);
router.post('/update/hospital', hospitalController.updateHospitals);
router.post('/delete/Hospital', hospitalController.DeleteHospitals);
router.delete('/deleteTechnician', hospitalController.Deletechnician);
router.delete('/addTechnician', hospitalController.addtechnician);

module.exports = router;
