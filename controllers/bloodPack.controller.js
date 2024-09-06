
const packService = require ("../services/BloodPack.service.js");
const hospitalservice = require("../services/hospital.service.js");
const userService = require("../services/user.service.js");


const createPack = async (req, res) => {
    const { pack, donor } = req.body;
    const { id } = req.params;

    try {
        const hospitalExists = await hospitalservice.getHospitalById(id);
        if (!hospitalExists) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        const packExists = await packService.getPacksById(pack?.id);
        if (packExists) {
            return res.status(400).json({ message: "Blood pack already exists!" });
        }
        const existingDonor = await userService.getUserByEmail(donor?.email);
        let donorId,donorGroup;

        if (existingDonor) {
            console.log("Existing Donor:", existingDonor);  // Log the full donor object
            donorId = existingDonor._id;
            donorGroup = existingDonor.bloodGroup;
        } else {
            const newDonor = await userService.registerUser(donor);
            console.log("New Donor:", newDonor);  // Log the full new donor object
            donorId = newDonor._id;
            donorGroup = newDonor.bloodGroup;
        }
        console.log(donorGroup);
        const newPack = { ...pack, donor: donorId,hospital:id,group:donorGroup };
        const addedPack = await packService.createPack(newPack);
        const savedPack = await addedPack.save();
      
        return res.status(200).json({ message: "New blood pack added successfully!", data: savedPack });
    } catch (error) {
        console.error("Error creating the pack: ", error);
        return res.status(500).json({ message: "Failed to create blood pack", error: error.message });
    }
};

const getAllPacks = async (req, res) => {
    try {
        console.log("dmk")
        const packs = await packService.getAllPacks();
        return res.status(200).json({message: "all packs fetched Successfully", data:packs})

    } catch(error) {
        console.error(error)
    }
}

const getAllPacksByGroup = async (req, res) => {
    try {
        const group = req.body;
        const packs = await packService.getPackByGroup(group);
        return res.status(200).json({message: "pack Successfully fetched", data:packs})

    } catch(error) {
        console.log(error)
    }
}
const getPacksById= async (req, res) => {
    try {
        const pack = await packService.getPacksById(req.params?.id); 
    
        if (!pack) {
            return res.status(404).json({ data: null, message: 'blood pack not found' });
        }
        return res.status(200).json({ data: pack, message: 'pack fetched successfully!' });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ data: null, message: 'An error occurred while fetching pack' });
    }
};
const DeletePacks = async(req, res) =>{
    const {id} = req.body;
    try {
        const pack = await packService.DeletePack(id);
        return res.status(200).json({message: `${pack} deleted successfully`, data:pack})
    } catch(error) {
        console.error(error)
    }
}

const updatePacks = async (req, res) => {
    const {id, pack} = req.body;
    try {
        const packs = await packService.updatePack(id, pack);
        return res.status(200).json({message:  "updated successfully", data:packs})
    } catch(error) {
        console.error(error)
    }
}
module.exports={
    updatePacks,
    DeletePacks,
    getAllPacks,
    getAllPacksByGroup,
    createPack,
    getPacksById
}




