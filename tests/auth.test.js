"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = __importDefault(require("../src/config/prisma"));
describe('Auth flow', () => {
    beforeAll(async () => {
        await prisma_1.default.user.deleteMany();
    });
    it('registers and logs in', async () => {
        const email = `user_${Date.now()}@test.com`;
        const password = 'password123';
        const r = await (0, supertest_1.default)(app_1.default).post('/api/register').send({ email, password });
        expect(r.status).toBe(201);
        const l = await (0, supertest_1.default)(app_1.default).post('/api/login').send({ email, password });
        expect(l.status).toBe(200);
        expect(l.body.token).toBeTruthy();
    });
});
