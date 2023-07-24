const StyleDictionary = require("style-dictionary");
const deepMerge = require("deepmerge");
const webConfig = require("./src/web/index.js");
const { createColorTailwindByType} = require("./fns.js");

StyleDictionary.registerTransform({
  name: "size/px",
  type: "value",
  matcher: (token) => {
    return (
      (token.unit === "pixel" || token.type === "dimension") &&
      token.value !== 0
    );
  },
  transformer: (token) => {
    return `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: "size/percent",
  type: "value",
  matcher: (token) => {
    return token.unit === "percent" && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}%`;
  },
});

StyleDictionary.registerFilter({
  name: "validToken",
  matcher: function (token) {
    return [
      // "dimension",
      // "string",
      // "number",
      "color",
      // "custom-spacing",
      // "custom-gradient",
      // "custom-fontStyle",
      // "custom-radius",
      // "custom-shadow",
    ].includes(token.type);
  },
});

const StyleDictionaryExtended = StyleDictionary.extend({
  ...deepMerge.all([
    // androidConfig,
    webConfig,
  ]),
  source: ["tokens/*.json"],
  format:{
    createColorTailwindByType
  },
  platforms: {
    web : {
      "transforms": ["attribute/cti", "name/cti/kebab", "size/px"],
      "buildPath": "build/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          filter: "validToken",
          options: {
            showFileHeader: false,
          },
        },
        {
          destination: "variables.scss",
          format: "scss/variables",
          filter: "validToken",
        },
        {
          "destination": `tailwind/color.json`,
          "format": "createColorTailwindByType"
        },
      ],
    }
  },
});
console.log("StyleDictionaryExtended", StyleDictionaryExtended);

StyleDictionaryExtended.buildAllPlatforms();
