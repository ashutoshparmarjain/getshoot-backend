"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function authToken() {
    const email = `p_${Date.now()}@test.com`;
    const password = 'password123';
    await (0, supertest_1.default)(app_1.default).post('/api/register').send({ email, password });
    const l = await (0, supertest_1.default)(app_1.default).post('/api/login').send({ email, password });
    return l.body.token;
}
describe('Product creation', () => {
    beforeAll(async () => {
        await prisma_1.default.product.deleteMany();
        await prisma_1.default.user.deleteMany();
    });
    it('creates a product without image', async () => {
        const token = await authToken();
        const r = await (0, supertest_1.default)(app_1.default)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'Demo Product');
        expect(r.status).toBe(201);
        expect(r.body.name).toBe('Demo Product');
    });
});
