import { Router } from 'express';
import { loginUser, registerUser, logoutUser, profile } from '../Controllers/user.controller.js';
import { authRequired } from '../Middlewares/validateToken.middleware.js';

const router = Router();

// Login a user
router.post('/login', loginUser);

// Register a user
router.post('/register', registerUser);

// Logout a user
router.post('/logout', logoutUser);

// Profile a user
router.get('/profile', authRequired, profile);

export default router;