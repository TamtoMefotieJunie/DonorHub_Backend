const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    packPrice:Number,
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