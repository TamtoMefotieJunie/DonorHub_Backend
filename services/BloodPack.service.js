const BloodSchema = require("../models/bloodPack.model.js");
const mongoose = require('mongoose');

const getAllPacks = async () => {
    return await BloodSchema.find();
};
   
const createPack = async (pack) => {
    return await BloodSchema.create(pack);
  };
const getPacksById = async (id) => {
    return await BloodSchema.findById(id).populate("hospital");
};
const getPacksByHospitalId = async (id) => {
    return await BloodSchema.find({ hospital: id }).populate("hospital");
};

const aggregatePacksByHospital = async (id) => {
    try {
        const results = await BloodSchema.aggregate([
            { $match: { hospital: new mongoose.Types.ObjectId(id) } },
            { $group: {
                _id: { group: "$group", components: "$components" },
                count: { $sum: 1 }
            }}
        ]);
        console.log("Aggregation Results:", results);
        return results;
    } catch (error) {
        console.error("Aggregation Error:", error);
        throw error;  // Throw error to be handled by the calling function
    }
};


const getPackByGroup = async (group)=>{
    return await BloodSchema.findOne(group)
};

const getOnePack = async (value)=>{
    return await BloodSchema.findOne(value).populate("hospital");
};
const updatePack = async (id, pack) => {
    return await BloodSchema.findByIdAndUpdate(id, pack);
  };
   
const DeletePack = async (id) => {
    return await BloodSchema.findByIdAndDelete(id);
};
module.exports = {
    createPack,
    getAllPacks,
    getPackByGroup,
    getPacksById,
    updatePack,
    DeletePack,
    getOnePack,
    getPacksByHospitalId,
    aggregatePacksByHospital,
};
