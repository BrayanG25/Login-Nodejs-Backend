import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Get environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_USER = process.env.JWT_USER_SERVICE;
const JWT_ROL = process.env.JWT_ROL_SERVICE;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Parse duration
const parseDuration = (duration) => {
    const units = {
        'ms': 1,
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000
    };

    const match = duration.match(/^(\d+)([smhd]?)$/);
    if (!match) {
        throw new Error('Invalid duration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] || 'ms';

    if (!units[unit]) {
        throw new Error('Invalid time unit');
    }

    return value * units[unit];
};

// Default token data
const DEFAULT_TOKEN_DATA = { 
    expiresIn: JWT_EXPIRATION, 
    exp: Date.now() + parseDuration(JWT_EXPIRATION) 
};

// Generate JWT token
export const generateToken = (payload) => {
    try {
        const tokenData = { ...payload, ...DEFAULT_TOKEN_DATA };
        return jwt.sign(tokenData, JWT_SECRET_KEY, { algorithm: 'HS256' });

    } catch (error) {
        throw new Error('Error generating the token');
    }
};


// Verify token
export const verifyToken = async (accessToken) => {
    try {
        const data = jwt.verify(accessToken, JWT_SECRET_KEY);

        if (data.exp < Date.now()) {
            return { valid: false, status: 401, message: 'Token expired', data: {} };
        }

        return { valid: true, status: 200, message: 'Token valid', data };

    } catch (error) {
        const errorTypes = {
            'TokenExpiredError': { message: 'Token expired', status: 401 },
            'JsonWebTokenError': { message: 'Invalid token', status: 403 },
            'default': { message: 'Unknown error', status: 403 }
        };
    
        const { message, status } = errorTypes[error.name] || errorTypes['default'];
    
        console.error(`Error validating token: ${error.message}`);
        return { valid: false, status, message, data: {} };
    }
};