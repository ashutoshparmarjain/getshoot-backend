import prisma from '../config/prisma';
import { uploadBufferToGcs } from '../utils/gcs';

export class ProductService {
  static async listByUser(userId: string) {
    return prisma.product.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  static async createProduct(
    userId: string,
    name: string,
    image?: { buffer: Buffer; originalname: string; mimetype: string }
  ) {
    let imageUrl: string | undefined;
    if (image) {
      imageUrl = await uploadBufferToGcs(image.buffer, image.originalname, image.mimetype);
    }
    return prisma.product.create({ data: { userId, name, imageUrl } });
  }

  static async getByIdOwned(productId: string, userId: string) {
    const product = await prisma.product.findFirst({ where: { id: productId, userId } });
    return product;
  }
}

