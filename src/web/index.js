const StyleDictionary = require('style-dictionary')
const { createTailwindTokens } = require('../../fns')

module.exports = {
  transform: {
    'size/px': require('./sizePx'),
    'web/shadow': require('./webShadows'),
    'web/radius': require('./webRadius'),
    'web/padding': require('./webPadding'),
    'web/font': require('./webFont'),
    'web/gradient': require('./webGradient'),
    'color/hex8ToRgba': require('../common/colorToRgbaString')
  },
  transformGroup: {
    'custom/css': StyleDictionary.transformGroup.css.concat([
      'size/px',
      'web/shadow',
      'web/radius',
      'web/padding',
      'web/font',
      'web/gradient',
      'color/hex8ToRgba'
    ])
  },
  format: {
    'custom/css': require('./formatCss'),
    createTailwindTokens
  },
  action: {}
}
