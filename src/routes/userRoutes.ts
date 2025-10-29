import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { settingsSchema } from '../utils/validation';
import { updateSettings } from '../controllers/userController';

const router = Router();

router.put('/settings', authMiddleware, validate(settingsSchema), updateSettings);

export default router;

