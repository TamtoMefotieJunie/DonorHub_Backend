
const hospitalservice = require("../services/hospital.service.js");
const userService = require("../services/user.service.js");
const bcrypt = require('bcrypt');

const createHospital = async (req, res) => {
    const { hospitalName,hospitalMatricule, hospitalAddress, adminName,adminMatricule, adminEmail, adminPassword } = req.body;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    try {
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            matriculationID:adminMatricule, 
            role: 'admin'
        });
        const savedAdmin = await userService.registerUser(admin);
        const hospital = new hospital({
            name: hospitalName,
            address: hospitalAddress,
            matriculationID:hospitalMatricule,
            admin: savedAdmin._id 
        });
        const savedHospital = await hospitalservice.createHospital(hospital);
        savedAdmin.hospital = savedHospital._id;
        await userService.updateUser(savedAdmin);
        return res.status(201).json({
            message: 'Hospital and Admin created successfully',
            hospital: savedHospital,
            admin: savedAdmin
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating hospital and admin',
            error: error.message
        });
    }
}

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalservice.getAllHospitals();
        return res.status(200).json({message: "Success", data:hospitals})

    } catch(error) {
        console.error({mesage:"an error occured while fetching all the hopsitals",error:error.message})
    }
}

const DeleteHospitals = async(req, res) =>{
    const {_id} = req.params;
    try {
        const hospital = await hospitalservice.DeleteHospital(_id);
        return res.status(200).json({message: "Hospital deleted successfully", data:hospital})
    } catch(error) {
        console.error({mesage:"an error occured while deleting the hopsitals",error:error.message})

    }
}

const updateHospitals = async (req, res) => {
    const _id = req.params;
    const hospital = req.body;
    try {
        const Hospital = await hospitalservice.updateHospital(_id, hospital);
        return res.status(200).json({message: "Hospital updated successfully", data:Hospital})
    } catch(error) {
        console.error({mesage:"an error occured while updating the hopsitals",error:error.message})
        
    }
}

const addtechnician = async (req, res) => {
    const {technician, hospital} = req.body;
   try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(technician?.password, salt)
        const newTech = {...technician, password:hashedPassword}
        const dbHospital = await hospitalservice.getHospitalByName(hospital?.name);
        const technicianObj = dbHospital.technicians.find(tech => tech.email===technician.email);
        if (technicianObj) return res.status(400).json({message: "Technician already added in this hospital !"});
        const AddedTechnician = dbHospital.technicians.push(newTech)
        try {
            const saved = dbHospital.save();
            return res.status(200).json({data:saved,message: "New technician added successfully !"});
        }
        catch(error) {
            console.error({message:"an error occured while saving the new lab tech",error:error.mesage})
        }
    }catch(error) {
        console.error(error);
    }
}

const Deletechnician = async (req, res) => {
    const { hospitalId, technicianId } = req.body;
    try {
        
        const hospital = await hospitalservice.getHospitalById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        const technicianIndex = hospital.technicians.indexOf(technicianId);
        if (technicianIndex === -1) {
            return res.status(404).json({ message: 'Technician not found in this hospital' });
        }
        hospital.technicians.splice(technicianIndex, 1);
        await hospital.save();
        await userService.deleteUSer(user?.technicianId);

        return res.status(200).json({ message: 'Technician deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting technician', error: error.message });
    }
};


module.exports={
    createHospital,
    getAllHospitals,
    DeleteHospitals,
    updateHospitals,
    Deletechnician,
    addtechnician,
    
}