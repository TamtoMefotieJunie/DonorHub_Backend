const BloodSchema = require("../models/bloodPack.model.js");

const getAllPacks = async () => {
    return await BloodSchema.find();
};
   
const createPack = async (pack) => {
    return await BloodSchema.create(pack);
  };
const getPacksById = async (id) => {
    return await BloodSchema.findById(id);
};

const getPackByGroup = async (group)=>{
    return await BloodSchema.findOne(group)
};

const getOnePack = async (value)=>{
    return await BloodSchema.findOne(value)
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
    getOnePack
};
