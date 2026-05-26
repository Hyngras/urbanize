// jest.config.js
module.exports = {
    roots: ["<rootDir>/tests"],
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
    transformIgnorePatterns: [
      "node_modules/(?!(@prisma|prisma)/)", // Adicione isso para transformar arquivos do Prisma
    ],
  };