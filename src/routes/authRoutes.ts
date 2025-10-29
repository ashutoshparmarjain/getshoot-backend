import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;

