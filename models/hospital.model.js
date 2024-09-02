const mongoose = require("mongoose")
const { userSchema } = require("../models/user.model");

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
       
        required: true 
    },
    matriculationID:String,
    technicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }]
},
    {
    timeStamps:true,
    }

)

module.exports = mongoose.model("Hospital", hospitalSchema);