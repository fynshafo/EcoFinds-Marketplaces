// auth.js
const crypto = require('crypto');


function hash(pw) {
return crypto.createHash('sha256').update(pw).digest('hex');
}


function sanitizeUser(u) {
const { password, ...rest } = u; return rest;
}


module.exports = { hash, sanitizeUser };
