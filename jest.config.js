"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^(.*)@src/(.*)$': '<rootDir>/src/$2'
    },
    setupFiles: ['dotenv/config']
};
exports.default = config;
