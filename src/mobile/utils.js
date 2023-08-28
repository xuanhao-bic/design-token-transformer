const { createArray, convertSomeTypeToKebabCase, deepen } = require('../../fns');

function generateTypeDefinition(obj, indent = "") {
    let typeDef = "{\n";
  
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        typeDef += `${indent}  "${key}": string;\n`;
      } else if (typeof obj[key] === "object") {
        typeDef += `${indent}  "${key}": ${generateTypeDefinition(obj[key], indent + "  ")}\n`;
      }
    }
  
    typeDef += `${indent}}`;
  
    return typeDef;
  }

function filterTokensByType(types, tokens) {
  const obj = tokens.reduce((acc, cur) => {
      if (types.includes(cur.type)) {
          // box shadow
          if (cur.type === 'custom-shadow') {
              acc[cur.path.join('.')] = `var(--${cur.name})`
              // font size and line height
          } else if (cur.type === 'custom-fontStyle') {
              acc[cur.path.join('.')] = [
                  `${cur.value.fontSize}px`,
                  {
                      lineHeight: `${cur.value.lineHeight}px`,
                      fontWeight: cur.value.fontWeight,
                  },
              ]
          } else {
              acc[cur.path.join('.')] = `${cur.value}`
          }
      }
      return acc
  }, {})
  const deep = deepen(obj)
  return convertSomeTypeToKebabCase(deep)
}

function createReactNativeTokens({ dictionary, platform }) {
  const array = createArray({ dictionary, platform })
  return JSON.stringify(
      filterTokensByType(
          ['color'],
          JSON.parse(array)
      )
  )
}

function createTokensTypes({ dictionary, platform }){
    const array = createArray({ dictionary, platform })
    const newTokens = filterTokensByType(
            ['color'],
            JSON.parse(array)
        );
    return typeDefinition = `export type ColorTypes = ${generateTypeDefinition(newTokens)};`;
}

module.exports = {
  createReactNativeTokens,
  createTokensTypes,
}
