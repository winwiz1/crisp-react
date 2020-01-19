const {defaults} = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  roots: [ "<rootDir>/src" ],
  setupFilesAfterEnv: [
    // not needed anymore
    //"@testing-library/react/cleanup-after-each",
    "@testing-library/jest-dom/extend-expect"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
    '^@backend/(.*)$': '<rootDir>/../server/src/api/$1',
  },  
};
