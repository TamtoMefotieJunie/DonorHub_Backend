const RoleSchema =require( "../models/role.model.js");

const getAllRolesByName = async (name) => {
    return await RoleSchema.findOne({name});
};

const createRole = async(role) => {
  return await RoleSchema.create(role);
};

const updateRole = async(name, newName) => {
  return await RoleSchema.findOneAndUpdate({name}, {name:newName});
};

const deleteRole = async(name) => {
  return await RoleSchema.findOneAndDelete({name});
};

const getAllRoles = async() => {
  return await RoleSchema.find();
};
const getAllRolesById=async(id)=>{
    return await RoleSchema.findById(id)
};

module.exports = {
    getAllRoles,
    deleteRole,
    updateRole,
    createRole,
    getAllRolesByName,
    getAllRolesById,
};