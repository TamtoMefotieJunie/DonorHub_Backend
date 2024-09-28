

    const sendMail = async (nodemailer, subject, email, message, type = 'contact', html = true) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'juniemefotie91@gmail.com',
                pass: 'fsktrkygtzwgewei'
            }
        });
    
        try {
            let mailOptions = {
                from: 'juniemefotie91@gmail.com',
                to: email,
                subject
            };
    
            if (html) {
                mailOptions['html'] = htmlTemplate(message, type);
            } else {
                mailOptions['text'] = message;
            }
    
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
    
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    };
    
    const htmlTemplate = (message, type = 'contact') => {
        switch (type) {
            case 'contact':
                return `<h1>${message}</h1><p>This is an emmergency email sent from <b>DonorHub</b> application.</p>`;
            case 'otp':
                return `<h1>${message}</h1><p>This is a test email for an OTP from <b>DonorHub</b>.</p>`;
            default:
                return `<p>${message}</p>`;
        }
    };
    
    module.exports = sendMail;
    