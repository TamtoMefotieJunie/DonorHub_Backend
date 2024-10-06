const paymentSchema = require('../models/payment.model.js') 
const axios = require('axios');
require('dotenv-flow').config();

const permanentAccessToken = process.env.APP_PERMANENT_TOKEN;

const apiClient = axios.create({
    baseURL: 'https://demo.campay.net/api',
    headers:{ 'Authorization': `Token ${permanentAccessToken}`,
              'Content-Type': 'application/json'
            },
})

const requestPayment = async(req,res) => {
    // console.log('Permanent Access Token:', permanentAccessToken);
 const {payment} = req.body;
 try{
        const paymentData = {
            amount: payment.amount,
            currency: payment.currency,
            from: payment.from,
            description: payment.description,
        }

        const result = await apiClient.post('/collect/',{
            ...paymentData,
            external_reference: "For blood Donation",
            external_user: ""
        });
        console.log('result: ', result)
        if (result && result.status === 200) {
            // Save the payment data in your database
            const savedPayment = await paymentSchema.create(paymentData);

            // Return success response
            return res.status(200).json({ message: "Payment made successfully", data: result?.data });
        } else {
            return res.status(500).json({ message: "Payment not successful" });
        }
    } catch (error) {
        // Log error for debugging
        console.error('Error during payment process:', error?.response?.data || error.message);
        
        // Return error response
        return res.status(500).json({ message: "An error occurred in the payment process", error: error.message });
    }
}

module.exports = {
    requestPayment
}