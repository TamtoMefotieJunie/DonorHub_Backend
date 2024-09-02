import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          rel: "User",
    },
    details: {
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
    tel: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Payment", PaymentSchema);