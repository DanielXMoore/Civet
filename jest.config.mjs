// NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest

import {defaults} from 'jest-config'

export default {
  extensionsToTreatAsEsm: [ '.civet', '.hera' ],
  moduleFileExtensions: [ ...defaults.moduleFileExtensions, 'civet', 'hera' ],
  testMatch: [ '<rootDir>/test/**/*.civet' ],
  transform: {
    '\\.civet': '<rootDir>/jest-transform.js',
    '\\.hera': '<rootDir>/hera-jest-transform.js',
  },
  verbose: true,
}
