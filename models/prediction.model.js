// models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    donorId: {
        type: String,
        required: true,
        index: true // Index for faster lookups by donorId
    },
    predictionDate: {
        type: Date,
        default: Date.now // Automatically set the date of prediction
    },
    status: {
        type: String,
        enum: ['new_donor', 'safe', 'unsafe'], // Enforce specific values
        required: true
    },
    isSafeToDonate: {
        type: Boolean,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    decisionFactors: {
        type: [String], // Array of strings
        default: []
    },
    donationMetrics: {
        totalDonations: Number,
        totalVolumeDonated: Number,
        donationRate: Number,
        averageVolume: Number,
        lastDonationMonthsAgo: Number,
        monthsSinceFirstDonation: Number
    },
    meetsBasicRequirement: {
        type: Boolean,
        required: true
    },
    recommendation: {
        type: String,
        required: true
    },
    debugInfo: { // Store the debug object if needed for later analysis
        type: mongoose.Schema.Types.Mixed // Mixed type allows for flexible schema
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports= mongoose.model('Prediction', predictionSchema);
