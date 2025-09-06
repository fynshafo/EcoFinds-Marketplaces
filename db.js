// db.js
const fs = require('fs');
const path = require('path');


const dataDir = path.join(__dirname, 'data');
const files = {
users: path.join(dataDir, 'users.json'),
products: path.join(dataDir, 'products.json'),
orders: path.join(dataDir, 'orders.json')
};


function ensureFiles() {
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
for (const f of Object.values(files)) {
if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf8');
}
}


function read(name) {
ensureFiles();
return JSON.parse(fs.readFileSync(files[name], 'utf8'));
}


function write(name, data) {
ensureFiles();
fs.writeFileSync(files[name], JSON.stringify(data, null, 2), 'utf8');
}


module.exports = { read, write };
