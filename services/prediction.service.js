
const Prediction = require("../models/prediction.model.js");

const getAllPredictions = async () => {
    return await Prediction.find();
};

const createPrediction = async (predictionData) => {
    return await Prediction.create(predictionData);
};


const getPredictionById = async (id) => {
    return await Prediction.findById(id);
};

const updatePrediction = async (id, updateData) => {
    return await Prediction.findByIdAndUpdate(id, updateData, { new: true });
};

const deletePrediction = async (id) => {
    return await Prediction.findByIdAndDelete(id);
};


module.exports = {
  getAllPredictions,
  createPrediction,
  getPredictionById,
  updatePrediction,
  deletePrediction
};