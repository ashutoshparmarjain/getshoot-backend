import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

async function authToken() {
  const email = `p_${Date.now()}@test.com`;
  const password = 'password123';
  await request(app).post('/api/register').send({ email, password });
  const l = await request(app).post('/api/login').send({ email, password });
  return l.body.token as string;
}

describe('Product creation', () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a product without image', async () => {
    const token = await authToken();
    const r = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Demo Product');
    expect(r.status).toBe(201);
    expect(r.body.name).toBe('Demo Product');
  });
});

