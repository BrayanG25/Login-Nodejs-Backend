import { sendStandardResponse } from '../Utils/responseBuilder.util.js';
import { validateRegisterUser, validateLoginUser } from '../Schemas/user.schema.js';
import { findUserByEmail, createUser, validatePassword } from '../Service/auth.service.js';
import { generateToken, verifyToken } from '../Service/jwt.service.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Controller to login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input data
        const { isValid, errors } = validateLoginUser({ email, password });
        if (!isValid) {
            const missingFields = errors.filter(error => error.message === 'Required').map(error => error.field);
            if (missingFields.length > 0) {
                return await sendStandardResponse(res, false, `The following keys are mandatory: ${missingFields.join(', ')}.`, 400, errors.filter(error => error.message === 'Required'));
            }
            return await sendStandardResponse(res, false, `The following fields have invalid information.`, 400, errors);
        }

        // Check if user already exists
        const userRecord = await findUserByEmail(email);
        if (!userRecord) {
            return await sendStandardResponse(res, false, 'The email address is not registered.', 400, [{ field: 'email', message: 'User unregistered.' }]);ñ
        }

        // Validate password
        const isPasswordValid  = await validatePassword(password, userRecord?.password);
        if (!isPasswordValid ) {
            return await sendStandardResponse(res, false, 'Password is invalid', 401, [{ field: 'password', message: 'Password is invalid' }]);
        }
        
        // Return relevant user data in the response
        const user = {
            user_id: userRecord?.user_id,
            username: userRecord?.username,
        };

        // Generate JSON web token
        const token = generateToken(user);

        await sendStandardResponse(res, true, 'Successfully login user', 200, user, {
            name: 'access_token',
            value: token,
            options: { 
                httpOnly: true, // The cookie can only be accessed from the server
                secure: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true, // The cookie can only be accessed on https
                sameSite: 'strict', // The cookie can only be accessed on the same https domain
                maxAge: 1000 * 60 * 60 // The cookie has a validity period of one hour, although the token remains the same
            }
        });

    } catch (error) {
        console.error('Error login user', error);
        await sendStandardResponse(res, false, 'Internal server error', 500);
    }
}

// Controller to register user in the database
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input data
        const { isValid, errors } = validateRegisterUser({ username, email, password });
        if (!isValid) {
            const missingFields = errors.filter(error => error.message === 'Required').map(error => error.field);
            if (missingFields.length > 0) {
                return await sendStandardResponse(res, false, `The following keys are mandatory: ${missingFields.join(', ')}.`, 400, errors.filter(error => error.message === 'Required'));
            }
            return await sendStandardResponse(res, false, `The following fields have invalid information.`, 400, errors);
        }

        // Check if user already exists
        const userRecord = await findUserByEmail(email);
        if (userRecord) {
            return await sendStandardResponse(res, false, 'The email address is already registered.', 400, [{ field: 'email', message: 'User already exists.' }]);
        }

        // Insert new user into the database
        const newUser = await createUser({ username, email, password });

        // Destructure and return relevant user data in the response
        const user = {
            user_id: newUser.user_id,
            username: newUser.username,
        };

        // Generate JSON web token
        const token = generateToken(user);

        return await sendStandardResponse(res, true, 'Operation successful', 200, user, {
            name: 'access_token',
            value: token,
            options: { 
                httpOnly: true, // The cookie can only be accessed from the server
                secure: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true, // The cookie can only be accessed on https
                sameSite: 'strict', // The cookie can only be accessed on the same https domain
                maxAge: 1000 * 60 * 60 // The cookie has a validity period of one hour, although the token remains the same
            }
        });

    } catch (error) {
        console.error('Error unregistered user:', error);
        await sendStandardResponse(res, false, 'Internal server error', 500);
    }
}

// Controller to logout user
export const logoutUser = async (req, res) => {
    try {
        await sendStandardResponse(res.clearCookie('access_token'), true, 'Successfully logout user', 200, {});

    } catch (error) {
        console.error('Error logout user', error);
        await sendStandardResponse(res, false, 'Internal server error', 500);
    }
}

// Controller to protected path user
export const protectedPathUser = async (req, res) => {
    try {
        const { access_token: accessToken } = req.cookies;
        
        if (!accessToken) {
            return await sendStandardResponse(res, false, 'Access not authorized', 403);
        }

        const { valid, status, message, data} = await verifyToken(accessToken);
        return await sendStandardResponse(res, valid, message, status, data);

    } catch (error) {
        console.error('Error protected path user user', error);
        await sendStandardResponse(res, false, 'Internal server error', 500);
    }
}