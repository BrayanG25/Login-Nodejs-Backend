import { Router } from 'express';
import { loginUser, registerUser, logoutUser, protectedPathUser } from '../Controllers/user.controller.js';

const router = Router();

// Login a user
router.post('/login', loginUser);

// Register a user
router.post('/register', registerUser);

// Logout a user
router.post('/logout', logoutUser);

// Protected path
router.post('/protected', protectedPathUser);

export default router;