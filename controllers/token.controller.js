const tokenService = require('../services/tokenService');

const createTokenForUser = async (req, res) => {
    const userId = req.body.userId; 

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const token = await tokenService.generateToken(userId); 
        if (!token) {
            return res.status(500).json({ message: 'Failed to generate token.' });
        }

        return res.status(201).json({ message: 'Token generated successfully!', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while generating token.', error: error.message });
    }
};
module.exports = createTokenForUser;