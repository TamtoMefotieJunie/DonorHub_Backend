const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-flow');
dotenv.config();

function verifyToken(req, res, next) {
    console.log("JWT Secret Key:", process.env.JWT_TOKEN_KEY);
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const token = authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        
        const decoded = jwt.verify(token.trim(), process.env.JWT_TOKEN_KEY);
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = verifyToken;
