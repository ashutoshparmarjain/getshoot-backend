"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function authToken() {
    const email = `g_${Date.now()}@test.com`;
    const password = 'password123';
    await (0, supertest_1.default)(app_1.default).post('/api/register').send({ email, password });
    const l = await (0, supertest_1.default)(app_1.default).post('/api/login').send({ email, password });
    return l.body.token;
}
describe('Generation flow', () => {
    beforeAll(async () => {
        await prisma_1.default.generation.deleteMany();
        await prisma_1.default.product.deleteMany();
        await prisma_1.default.user.deleteMany();
    });
    it('creates a generation and lists variants', async () => {
        const token = await authToken();
        // Create a product first
        const productRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'Test Product');
        expect(productRes.status).toBe(201);
        const productId = productRes.body.id;
        // Create a generation
        const genRes = await (0, supertest_1.default)(app_1.default)
            .post(`/api/products/${productId}/generate`)
            .set('Authorization', `Bearer ${token}`)
            .send({ prompt: 'Test prompt' });
        expect(genRes.status).toBe(201);
        expect(genRes.body.status).toBe('pending');
        // List variants
        const variantsRes = await (0, supertest_1.default)(app_1.default)
            .get(`/api/products/${productId}/variants`)
            .set('Authorization', `Bearer ${token}`);
        expect(variantsRes.status).toBe(200);
        expect(variantsRes.body).toHaveLength(1);
    });
});
