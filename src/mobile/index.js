const StyleDictionary = require('style-dictionary');
const { createReactNativeTokens, createTokensTypes } = require('./utils')

module.exports = {
  transform: {
    'color/hex8ToRgba': require('../common/colorToRgbaString')
  },
  transformGroup: {
    'custom/react-native': StyleDictionary.transformGroup['react-native'].concat([
      'color/hex8ToRgba'
    ])
  },
  format: {
    createReactNativeTokens,
    createTokensTypes,
  },
  action: {}
}
