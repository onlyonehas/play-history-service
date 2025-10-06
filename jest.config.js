export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\.ts$': ['ts-jest', {
      useESM: true
    }]
  }
};
