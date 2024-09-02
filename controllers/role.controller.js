
const roleService = require('../services/role.service');

const getAllRoles=async(req,res)=>{
    try{
        
        const roles = await roleService.getAllRoles();

        return res.status(200).json({data: roles, message: 'Role fetch successfully !!!'})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:'An error occured while fetching roles',error: err.message})
    }
}
const getAllRolesByName=async(req,res)=>{
    try{
        
        const roles = await roleService.getAllRolesByName(req.params?.name);

        return res.status(200).json({data: roles, message: 'Role fetched successfully !!!'})

    }catch(err){
        return res.status(500).json('An error occured while fetching roles')
    }
}

const getAllRolesById=async(req,res)=>{
    try{
        const roles = await roleService.getAllRolesById(req.params?.id);
        return res.status(200).json({data: roles, message: 'Role fetch successfully !!!'})
    }catch(err){
        console.log(err.message)
        return res.status(500).json('An error occured while fetching roles')
    }
}


const createRole=async(req,res)=>{
    try{
        const role = await roleService.getAllRolesByName(req.body?.name)
        if (role) return res.status(400).json({message: "Role exists already !"});
        try {
            const newrole = await roleService.createRole({name:req.body?.name});
            return res.status(201).json({data:newrole,message:'Role created successfully !!!'})
        }catch(err){
            return res.status(500).json({message:'An error occured when creating role',error:err.message})
        }
    }catch(err){
        return res.status(500).json('An error occured when getting role')
    }
}
const updateRole = async (req, res) => {
    const update = req.body.name;
    const initial = req.params?.name;
    try {
        const updatedRole = await roleService.updateRole(initial, update);
        return res.status(200).json({message: "Role updated successfully !", data:updatedRole});
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message :'An error occured when updating role',error: error.message})
    }
}

const deleteRole = async (req, res) => {
    try {
        const deletedRole = await roleService.deleteRole(req.params?.name);
        return res.status(200).json({message: "Role deleted successfully !", data:deletedRole});
    }catch(error) {
        console.error(error);
        return res.status(500).json('An error occured when deleting role')
    }
}

module.exports={
    createRole,
    getAllRoles,
    getAllRolesByName,
    getAllRolesById,
    updateRole,
    deleteRole,
}