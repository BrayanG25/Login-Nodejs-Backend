import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, string } from './dataType.schema.js';

/**
    Define the schema for user registration.
    - email: Must follow a valid email format.
    - password: Must meet the specified complexity requirements.
    - username: Must be at least 3 characters long.
*/

const registerUserSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema
});

/**
    * Validate user registration data.
    * @param {Object} data - The user registration data to validate.
    * @returns {Object} - An object containing validation status and errors if any.
*/

export const validateRegisterUser = (data) => {
    try {
        registerUserSchema.parse(data);
        return { isValid: true, errors: null };
        
    } catch (e) {
        const detailedErrors = e.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));
        return { isValid: false, errors: detailedErrors };
        // return { isValid: false, errors: e.errors };
    }
};

/**
    Define the schema for user login.
    - email: Must follow a valid email format.
*/

const loginUserSchema = z.object({
    email: emailSchema,
    password: string
});

/**
    * Validate user login data.
    * @param {Object} data - The user login data to validate.
    * @returns {Object} - An object containing validation status and errors if any.
*/

export const validateLoginUser = (data) => {
    try {
        loginUserSchema.parse(data);
        return { isValid: true, errors: null };
        
    } catch (e) {
        const detailedErrors = e.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));
        return { isValid: false, errors: detailedErrors };
        // return { isValid: false, errors: e.errors };
    }
};