const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          rel: "User",
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
    },
    hospital: {
        type: String
    },
    from: {
        type: String
    },
    currency: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Payment',PaymentSchema);