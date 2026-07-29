export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
    testMatch: [
        "**/__tests__/**/*.test.js"
    ],

    collectCoverage: true,

    coverageDirectory: "coverage",

    transform: {},

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
};