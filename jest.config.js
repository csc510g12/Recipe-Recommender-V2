// module.exports = {
//   setupFiles: ['./jest.setup.js'],
//   testEnvironment: 'jsdom',
//   transform: {
//     '^.+\\.jsx?$': 'babel-jest',
//   },
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//   },
//   moduleFileExtensions: ['js', 'jsx'],
// };

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/components/(.*)$': './Code/frontend/src/components/$1'
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  moduleFileExtensions: ['js', 'jsx']
};