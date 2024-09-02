const mongoose = require("mongoose")
const { userSchema } = require("../models/user.model");

const BloodPackSchema = new mongoose.Schema({
    type: String,
    group: String,
    components:String,
    CollectionDate:Date,
    ExpirationDate:Date,
    donor: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null
    },
    price: { type: Number, required: true},
    
    status:{type:String, 
        enum:["Available","Expired","Bought"], 
        default:"Available",
    },
    hospital:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
},
    {
    timeStamps:true,
    }

)

const BloodModel = mongoose.model("BloodPack", BloodPackSchema);
module.exports =  {
    BloodModel
}