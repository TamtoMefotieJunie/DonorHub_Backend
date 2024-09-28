const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name:String,
    email: {
      type: String,
      unique: true,
    },
    password:  String,
    telephone: String,
    
    image:{
        type:String,
        default:null,
    },
    bloodGroup:String,
    gender:{
        type:String,
        enum:['male','female'],
    },
    dob:Date,
    address:String,
    lastDonationDate:{
        type:String,
        default:null,
    },
    matriculationID:String,
    authToken: String,
    auth:{
        type: String,
        enum:['google','facebook','apple','email_and_password'],
        default: 'email_and_password'
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Roles',
        required:true,
    },
    hospital:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Hospital'
  },
 
   
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel