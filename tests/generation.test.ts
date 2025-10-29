import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

async function authToken() {
  const email = `g_${Date.now()}@test.com`;
  const password = 'password123';
  await request(app).post('/api/register').send({ email, password });
  const l = await request(app).post('/api/login').send({ email, password });
  return l.body.token as string;
}

describe('Generation flow', () => {
  beforeAll(async () => {
    await prisma.generation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a generation and lists variants', async () => {
    const token = await authToken();
    
    // Create a product first
    const productRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Product');
    expect(productRes.status).toBe(201);
    const productId = productRes.body.id;

    // Create a generation
    const genRes = await request(app)
      .post(`/api/products/${productId}/generate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Test prompt' });
    expect(genRes.status).toBe(201);
    expect(genRes.body.status).toBe('pending');

    // List variants
    const variantsRes = await request(app)
      .get(`/api/products/${productId}/variants`)
      .set('Authorization', `Bearer ${token}`);
    expect(variantsRes.status).toBe(200);
    expect(variantsRes.body).toHaveLength(1);
  });
});

