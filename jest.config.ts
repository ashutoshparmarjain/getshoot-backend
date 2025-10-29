import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^(.*)@src/(.*)$': '<rootDir>/src/$2'
  },
  setupFiles: ['dotenv/config']
};

export default config;

