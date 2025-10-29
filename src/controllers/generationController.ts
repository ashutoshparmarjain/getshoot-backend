import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProductService } from '../services/ProductService';
import { GenerationService } from '../services/GenerationService';
import { getValidatedData } from '../middleware/validationMiddleware';
import { GenerateInput, PaginationInput } from '../utils/validation';

export async function createGeneration(req: AuthRequest, res: Response) {
  const { prompt } = getValidatedData<GenerateInput>(req);
  const product = await ProductService.getByIdOwned(req.params.id, req.user!.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  console.log("starting to create variant")
  const gen = await GenerationService.createVariant(product, prompt);
  return res.status(201).json(gen);
}

export async function listGenerations(req: AuthRequest, res: Response) {
  const product = await ProductService.getByIdOwned(req.params.id, req.user!.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  const { page, limit } = getValidatedData<PaginationInput>(req, "query");
  console.log(page, limit)
  const result = await GenerationService.listByProduct(product.id, page, limit);
  return res.json(result);
}

