module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/core/$1',
    '@ui/(.*)': '<rootDir>/src/ui/$1',
    '@stores': '<rootDir>/src/stores'
  },
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)']
};
