
const predictionService = require("../services/prediction.service"); 

const getAllPredictions = async (req, res) => {
  try {
    const predictions = await predictionService.getAllPredictions();
    res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in getAllPredictions controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const createPrediction = async (req, res) => {
  const predictionData = req.body;

  if (!predictionData) {
    return res.status(400).json({ message: "Prediction data is required." });
  }

  try {
    const newPrediction = await predictionService.createPrediction(predictionData);
    res.status(201).json(newPrediction); 
  } catch (error) {
    console.error("Error in createPrediction controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPredictionById = async (req, res) => {
  const { id } = req.params;

  try {
    const prediction = await predictionService.getPredictionById(id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found." });
    }
    res.status(200).json(prediction);
  } catch (error) {
    console.error(`Error in getPredictionById controller for ID ${id}:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

const updatePrediction = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!updateData) {
    return res.status(400).json({ message: "Update data is required." });
  }

  try {
    const updatedPrediction = await predictionService.updatePrediction(id, updateData);
    if (!updatedPrediction) {
      return res.status(404).json({ message: "Prediction not found for update." });
    }
    res.status(200).json(updatedPrediction);
  } catch (error) {
    console.error(`Error in updatePrediction controller for ID ${id}:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

const deletePrediction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPrediction = await predictionService.deletePrediction(id);
    if (!deletedPrediction) {
      return res.status(404).json({ message: "Prediction not found for deletion." });
    }
    res.status(200).json({ message: "Prediction deleted successfully.", deletedPrediction });
  } catch (error) {
    console.error(`Error in deletePrediction controller for ID ${id}:`, error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllPredictions,
  createPrediction,
  getPredictionById,
  updatePrediction,
  deletePrediction
};