const nodemailer = require('nodemailer');
const sendMail = require('../utils/helper');
const emailService = require("../services/email.service.js");


const contactFriend = async (req, res) => {
    try {
        const { message, email } = req.body;

        
        const isMessageSent = await sendMail(
            nodemailer,
            'DONORHUB',
            email,
           `
            <img style="width:150px; border-radius:100%;" src="cid:unique@cid" />
            <h1 style="color:red;font-size:26px;font:bold;">Your help is needed!!!</h1>
            <p><i>${message}</i></p>`
        );

        if (isMessageSent) {
           
            await emailService.createMail({
                text: message,
                receiverEmail: email,
                subject: 'You got a new message',
                senderEmail: 'juniemefotie91@gmail.com',
              });
            res.status(200).json({ message: 'Message sent successfully!' });
        } else {
            res.status(500).json({ error: 'Failed to send email.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { contactFriend };
