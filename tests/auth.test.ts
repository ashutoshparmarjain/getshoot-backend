import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('Auth flow', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  it('registers and logs in', async () => {
    const email = `user_${Date.now()}@test.com`;
    const password = 'password123';
    const r = await request(app).post('/api/register').send({ email, password });
    expect(r.status).toBe(201);

    const l = await request(app).post('/api/login').send({ email, password });
    expect(l.status).toBe(200);
    expect(l.body.token).toBeTruthy();
  });
});

