/**
 * Configuration Jest pour les tests
 */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    '!node_modules/**'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};
