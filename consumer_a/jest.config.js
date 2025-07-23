module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js',
    '!swagger.js',
    '!swagger_output.json',
    '!coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};
