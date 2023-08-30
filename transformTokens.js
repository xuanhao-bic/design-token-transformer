const StyleDictionary = require('style-dictionary')
const deepMerge = require('deepmerge')
const webConfig = require('./src/web/index.js')
const mobileConfig = require('./src/mobile/index.js')
const { createColorTailwindByType } = require('./fns.js')

StyleDictionary.registerTransform({
    name: 'size/px',
    type: 'value',
    matcher: (token) => {
        return (
            (token.unit === 'pixel' || token.type === 'dimension') &&
            token.value !== 0
        )
    },
    transformer: (token) => {
        return `${token.value}px`
    },
})

StyleDictionary.registerTransform({
    name: 'size/percent',
    type: 'value',
    matcher: (token) => {
        return token.unit === 'percent' && token.value !== 0
    },
    transformer: (token) => {
        return `${token.value}%`
    },
})

StyleDictionary.registerFilter({
    name: 'validToken',
    matcher: function (token) {
        return [
            // "dimension",
            // "string",
            // "number",
            'color',
            // "custom-spacing",
            // "custom-gradient",
            // "custom-fontStyle",
            // "custom-radius",
            'custom-shadow',
        ].includes(token.type)
    },
})

const StyleDictionaryExtended = StyleDictionary.extend({
    ...deepMerge.all([webConfig, mobileConfig]),
    source: ['tokens/*.json'],
    platforms: {
        scss: {
            transformGroup: 'custom/css',
            buildPath: 'build/scss/',
            files: [
                {
                    destination: 'variables.scss',
                    format: 'scss/variables',
                    filter: 'validToken',
                },
            ],
        },
        css: {
            transformGroup: 'custom/css',
            buildPath: 'build/css/',
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables',
                    filter: 'validToken',
                    options: {
                        showFileHeader: false,
                    },
                },
            ],
        },
        tailwind: {
            transforms: ['attribute/cti', 'name/cti/kebab'],
            buildPath: 'build/tailwind/',
            files: [
                {
                    destination: 'tokens.json',
                    format: 'createTailwindTokens',
                },
            ],
        },
        reactNative: {
            transformGroup: 'custom/react-native',
            buildPath: 'build/mobile/',
            files: [
                {
                    destination: 'color.json',
                    format: 'createReactNativeTokens',
                },
                {
                    destination: 'colorTypes.ts',
                    format: 'createTokensTypes',
                },
            ],
        },
    },
})
// console.log("StyleDictionaryExtended", StyleDictionaryExtended);

StyleDictionaryExtended.buildAllPlatforms()
