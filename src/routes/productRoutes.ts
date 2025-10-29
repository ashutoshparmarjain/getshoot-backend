import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { productCreateSchema, generateSchema, paginationSchema } from '../utils/validation';
import { createProduct, getProduct, listProducts } from '../controllers/productController';
import { createGeneration, listGenerations } from '../controllers/generationController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/products', authMiddleware, listProducts);
router.post('/products', authMiddleware, upload.single('image'), validate(productCreateSchema), createProduct);
router.get('/products/:id', authMiddleware, getProduct);

router.post('/products/:id/generate', authMiddleware, validate(generateSchema), createGeneration);
router.get('/products/:id/variants', authMiddleware, validate(paginationSchema, "query"), listGenerations);

export default router;

