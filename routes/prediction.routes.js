
const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/prediction.controller"); 

router.get("/getAll", predictionController.getAllPredictions);
router.post("/createNew", predictionController.createPrediction);
router.get("/:id", predictionController.getPredictionById);
router.put("/update/:id", predictionController.updatePrediction);
router.delete("/delete/:id", predictionController.deletePrediction);

module.exports = router;