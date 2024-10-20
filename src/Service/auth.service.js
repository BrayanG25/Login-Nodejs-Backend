import { User } from '../Database/Models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return user ? user.dataValues : null;
        
    } catch (error) {
        throw new Error('Error fetching user from the database');
    }
};

export const findUserById = async (id) => {
    try {
        const user = await User.findOne({ where: { user_id: id } });
        return user ? user.dataValues : null;
        
    } catch (error) {
        throw new Error('Error fetching user from the database');
    }
};

const hashPassword = async (password) => {
    try {
        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 5;
        return await bcrypt.hash(password, SALT_ROUNDS);

    } catch (error) {
        throw new Error('Error hashing the password');
    }
};

export const createUser = async ({ username, email, password }) => {
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            user_id: crypto.randomUUID(),
            username: username,
            email: email,
            password: hashedPassword,
            active: true,
            created_at: new Date(),
        });
        return newUser;
    } catch (error) {
        throw new Error('Error creating a new user in the database');
    }
};

export const validatePassword = async (inputPassword, storedPasswordHash) => {
    try {
        return await bcrypt.compare(inputPassword, storedPasswordHash);

    } catch (error) {
        throw new Error('Error validating the password');
    }
};