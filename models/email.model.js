const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    to: String,
    subject: String,
    text: String,
    senderEmail:String,
    receiverEmail:String,
    sentAt: { type: Date, default: Date.now }
});

const Email = mongoose.model('Email', emailSchema);
module.exports = Email;