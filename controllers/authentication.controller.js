const userService = require('../services/user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-flow');

dotenv.config({ path: '.env.local' });

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail( email );

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed ' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        });

        return res.status(200).json({ token:token, user:user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Login failed',error:error.message });
    }
}
const getLoggedInUser = async(req, res) => {
    
        try {
            const userId = req.body.userId; 
            console.log("User ID from token:", userId); 
            const user = await userService.getUserById(userId); 
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { password, ...userData } = user.toObject(); 
    
            return res.status(200).json({ user: userData }); 
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving user data', error: error.message });
        }
    };

module.exports={
    getLoggedInUser,
    loginUser,
}