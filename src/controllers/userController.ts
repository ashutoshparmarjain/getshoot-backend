import { Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/authMiddleware';
import { getValidatedData } from '../middleware/validationMiddleware';
import { SettingsInput } from '../utils/validation';

export async function updateSettings(req: AuthRequest, res: Response) {
  const { displayName } = getValidatedData<SettingsInput>(req);
  const userId = req.user!.id;
  const user = await UserService.updateDisplayName(userId, displayName);
  return res.json({ id: user.id, displayName: user.displayName });
}

