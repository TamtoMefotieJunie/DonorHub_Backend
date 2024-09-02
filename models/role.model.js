const mongoose = require("mongoose")

const roleSchema = mongoose.Schema({
        name: String,        
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('Roles',roleSchema) 