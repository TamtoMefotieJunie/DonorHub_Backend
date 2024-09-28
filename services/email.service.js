const emailSchema =  require("../models/email.model.js")
const mongoose = require('mongoose')

const getAllMails = async () => {
    return await emailSchema.find();
};
   
const createMail = async (message,email) => {
    return await emailSchema.create(message,email);
};

module.exports = {
    getAllMails,
    createMail
}