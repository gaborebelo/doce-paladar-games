const crypto = require('crypto');
function genCode(){
  const raw = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex
  return 'DP-' + raw.slice(0,3) + raw.slice(3,6) + '-' + (Math.floor(Math.random()*90)+10);
}
module.exports = { genCode };
