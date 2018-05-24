const fs = require('fs');

const configPath = './config.json';
// When receiving data from a web server, the data is always a string.
// this converts it into used json
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// We have to export each object in order to access them separately
exports.firebasekey = parsed.firebasekey;