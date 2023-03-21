const fs = require('fs');
var packagejson = require(process.env.TARGET_FILE);
packagejson.build.linux.target = [];
fs.writeFileSync(process.env.TARGET_FILE, JSON.stringify(packagejson));
