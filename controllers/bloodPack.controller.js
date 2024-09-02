
const packService = require ("../services/hospital.service.js");

const createPack = async (req, res) => {
    try {
        
        const newPack = {...pack, donor: {...pack.donor}}
        const isNew = await packService.getPacksById(pack?.id);
        if (isNew){
            return res.status(400).json({message: "blood pack already exists !"});
        }
        try {
            const addPack = await packService.createPack(newPack);
            return res.status(200).json({message: "New hospital added successfully !", data:addPack});
        }
        catch(error) {
            console.error(error);
        }
    }
    catch(error) {
        console.error(error)
    }
}
const getAllPacks = async (req, res) => {
    try {
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
        return res.status(200).json({message: Success, data:packs})

    } catch(error) {
        console.error(error)
    }
}

const DeletePacks = async(req, res) =>{
    const {_id} = req.body;
    try {
        const pack = await packService.DeletePack(_id);
        return res.status(200).json({message: `${pack} deleted successfully`, data:pack})
    } catch(error) {
        console.error(error)
    }
}

const updatePacks = async (req, res) => {
    const {_id, pack} = req.body;
    try {
        const packs = await packService.updatePack(_id, pack);
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
    createPack
}




