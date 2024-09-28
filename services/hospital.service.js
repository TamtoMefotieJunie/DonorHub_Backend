const hospitalSchema = require("../models/hospital.model.js");

const getAllHospitals = async () => {
    return await hospitalSchema.find();
};
   
const createHospital = async (hospital) => {
    return await hospitalSchema.create(hospital);
};
const getHospitalById = async (id) => {
  return await hospitalSchema.findById(id);
};

const getHospitalByName = async (name)=>{
  return await hospitalSchema.findOne({name})
}

const getHospitalsByLocation = async (location) => {
  return await hospitalSchema.find({location})
}

const getOneHospital = async (admin)=>{
  return await hospitalSchema.findOne(admin)
}
   
const updateHospital = async (id, hospital) => {
  return await hospitalSchema.findByIdAndUpdate(id, hospital, { new: true });
};
   
const DeleteHospital = async (id) => {
  return await hospitalSchema.findByIdAndDelete(id);
};


module.exports = {
  getAllHospitals,
  getHospitalByName,
  getHospitalsByLocation,
  getOneHospital,
  updateHospital,
  DeleteHospital,
  createHospital,
  getHospitalById,
};
