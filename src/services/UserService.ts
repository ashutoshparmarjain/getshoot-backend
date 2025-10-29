import bcrypt from 'bcrypt';
import prisma from '../config/prisma';

export class UserService {
  static async createUser(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { email, passwordHash } });
  }

  static async authenticate(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  static async updateDisplayName(userId: string, displayName: string) {
    return prisma.user.update({ where: { id: userId }, data: { displayName } });
  }
}

