const tokens = require('./build/tailwind/tokens.json')

module.exports = {
    tokens: JSON.parse(JSON.stringify(tokens)),
}
