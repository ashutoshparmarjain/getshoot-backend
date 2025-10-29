import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { issueToken } from "../utils/jwt";
import { getValidatedData } from "../middleware/validationMiddleware";
import { RegisterInput, LoginInput } from "../utils/validation";

export async function register(req: Request, res: Response) {
  const { email, password, displayName } = getValidatedData<RegisterInput>(req);
  try {
    const user = await UserService.createUser(email, password, displayName);
    const token = issueToken({ id: user.id });
    return res.status(201).json({
      token,
      user: { displayName: user.displayName, email: user.email },
    });
  } catch (e: any) {
    if (e.code === "P2002")
      return res.status(409).json({ error: "Email already registered" });
    return res.status(500).json({ error: "Failed to register" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = getValidatedData<LoginInput>(req);
  const user = await UserService.authenticate(email, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = issueToken({ id: user.id });
  return res.json({
    token,
    user: { displayName: user.displayName, email: user.email },
  });
}
