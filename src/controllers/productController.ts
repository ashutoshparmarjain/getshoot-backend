import { Response } from 'express';
import { ProductService } from '../services/ProductService';
import { AuthRequest } from '../middleware/authMiddleware';
import { getValidatedData } from '../middleware/validationMiddleware';
import { ProductCreateInput } from '../utils/validation';
import prisma from '../config/prisma';

export async function listProducts(req: AuthRequest, res: Response) {
  const products = await ProductService.listByUser(req.user!.id);
  return res.json(products);
}

export async function createProduct(req: AuthRequest, res: Response) {
  const { name } = getValidatedData<ProductCreateInput>(req);
  const file = (req as any).file as Express.Multer.File | undefined;
  const image = file
    ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype }
    : undefined;
  const product = await ProductService.createProduct(req.user!.id, name, image);
  return res.status(201).json(product);
}

export async function getProduct(req: AuthRequest, res: Response) {
  const product = await prisma.product.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!product) return res.status(404).json({ error: 'Not found' });
  return res.json(product);
}

