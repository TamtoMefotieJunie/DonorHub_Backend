
const packService = require ("../services/BloodPack.service.js");
const hospitalservice = require("../services/hospital.service.js");
const userService = require("../services/user.service.js");
const axios = require('axios')

const volumeStandards = {
    RBC: { volume: 30 }, // Average volume for RBC
    PLT: { volume: 50 }, // Average volume for Platelets
    PL: { volume: 45 },  // Average volume for Plasma
    Cryoprecipitate: { volume: 20 } // Average volume for Cryoprecipitate
};

const calculateTotalVolume = (components) => {
    let totalVolume = 0;
    components.forEach(component => {
        if (volumeStandards[component]) {
            totalVolume += volumeStandards[component].volume; // Add the standard volume
        }
    });
    return totalVolume;
};

const createPack = async (req, res) => {
    const { pack, donor } = req.body;
    const { id } = req.params;
    let donorId,donorGroup,hospitalPrice;
    try {
        const hospitalExists = await hospitalservice.getHospitalById(id);
        if (!hospitalExists) {
            return res.status(404).json({ message: "Hospital not found" });
        }else{
            console.log("Existing hospital:", hospitalExists);  
            hospitalPrice = hospitalExists.packPrice;
        }
        const packExists = await packService.getPacksById(pack?.id);
        if (packExists) {
            return res.status(400).json({ message: "Blood pack already exists!" });
        }
        const existingDonor = await userService.getUserByEmail(donor?.email);
        if (existingDonor) {
            console.log("Existing Donor:", existingDonor);  
            donorId = existingDonor._id;
            donorGroup = existingDonor.bloodGroup;
        } else {
            const newDonor = await userService.registerUser(donor);
            console.log("New Donor:", newDonor); 
            donorId = newDonor._id;
            donorGroup = newDonor.bloodGroup;
        }
        console.log(donorGroup);
        const newPack = { ...pack, donor: donorId,hospital:id,group:donorGroup,price:hospitalPrice };
        const addedPack = await packService.createPack(newPack);
        const savedPack = await addedPack.save();
      
        return res.status(200).json({ message: "New blood pack added successfully!", data: savedPack });
    } catch (error) {
        console.error("Error creating the pack: ", error);
        return res.status(500).json({ message: "Failed to create blood pack", error: error.message });
    }
};



const checkDonor = async (req, res) => {
    const { donorId } = req.body;

    try {
        const bloodPacks = await packService.getBloodPacksByDonorId(donorId);

        if (!bloodPacks.length) {
            return res.status(404).json({ message: 'No blood packs found for this donor' });
        }

        let totalVolumeDonated = 0;
        let numberOfDonations = bloodPacks.length;
        let firstDonationDate = null;
        let lastDonationDate = null;

        bloodPacks.forEach(pack => {
            const components = pack.components.split(/[,/]/);
            components.forEach(component => {
                if (volumeStandards[component]) {
                    totalVolumeDonated += volumeStandards[component].volume;
                }
            });

            const collectionDate = new Date(pack.CollectionDate);

            if (!firstDonationDate || collectionDate < firstDonationDate) {
                firstDonationDate = collectionDate;
            }

            if (!lastDonationDate || collectionDate > lastDonationDate) {
                lastDonationDate = collectionDate;
            }
        });

        const currentDate = new Date();

        const monthsSinceFirstDonation =
            (currentDate.getFullYear() - firstDonationDate.getFullYear()) * 12 +
            (currentDate.getMonth() - firstDonationDate.getMonth());

        const monthsSinceLastDonation =
            (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 +
            (currentDate.getMonth() - lastDonationDate.getMonth());

        const donatingFor = monthsSinceFirstDonation - monthsSinceLastDonation;
        // Send features to Flask AI microservice
        const aiResponse = await axios.post('http://127.0.0.1:5001/predict', {
            monthsSinceLastDonation,
            numberOfDonations,
            monthsSinceFirstDonation,
            donatingFor
        });

        const aiResult = aiResponse.data;

        return res.status(200).json({
            monthsSinceLastDonation,
            numberOfDonations,
            totalVolumeDonated,
            monthsSinceFirstDonation,
            meetsBasicRequirement: monthsSinceLastDonation >= 3,
            isSafeToDonate: aiResult.canDonateAgain,
            modelPrediction: aiResult.model,
            recommendation: aiResult.canDonateAgain ? "Safe to donate" : "Not safe to donate",
            predictionProbability: aiResult.predictionProbability
        });

    } catch (error) {
        console.error("Error checking donor:", error.message);
        return res.status(500).json({
            message: 'An error occurred while checking donor',
            error: error.message
        });
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
const getPacksByHospitalId = async (req, res) => {
    const hospitalId = req.params.id; 
  
    try {
        const packs = await packService.getPacksByHospitalId(hospitalId);
        const aggregatedData = await packService.aggregatePacksByHospital(hospitalId);

        if (packs.length === 0) {
            return res.status(404).json({ message: 'No blood packs found for this hospital' });
        }
        
        console.log('Hospital ID:', hospitalId);
        console.log('Packs:', packs);
        console.log('Aggregated Data Length:', aggregatedData.length);
       

        return res.status(200).json({
            message: 'Packs fetched successfully!',
            data: packs,  
            aggregation: aggregatedData  
        });
    } catch (err) {
        console.log("Error fetching packs:", err);
        return res.status(500).json({ message: 'An error occurred while fetching packs', error: err.message });
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
    getPacksById,
    getPacksByHospitalId,
    checkDonor,
}




