// NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest

import {defaults} from 'jest-config'

export default {
  extensionsToTreatAsEsm: [ '.civet' ],
  moduleFileExtensions: [ ...defaults.moduleFileExtensions, 'civet' ],
  testMatch: [ '<rootDir>/test/**/*.civet' ],
  transform: {
    // You should use the transform like this:
    //'\\.civet': 'civet-jest',
    // For local testing, we use the following:
    '\\.civet': './', // 'civet-jest',
  },
  verbose: true,
}
