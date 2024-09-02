const tokenSchema = require("../models/token.model.js");

const getAllTokens = async () => {
    return await tokenSchema.find();
};
   
const createToken = async (token) => {
    return await tokenSchema.create(token);
};

const getTokenByValue = async (token) => {
    return await tokenSchema.findOne(token);
};
const deleteToken = async (id) => {
    return await tokenSchema.findByIdAndDelete(id);
};


module.exports={
    deleteToken,
    getAllTokens,
    createToken,
    getTokenByValue,
    
}