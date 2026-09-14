require('dotenv').config();
const { getToken } = require('./auth');

console.log('URL:', process.env.DATAVERSE_URL);
console.log('Tenant:', process.env.TENANT_ID);

getToken()
  .then(t => console.log('Token:', t.substring(0, 50) + '...'))
  .catch(e => console.error('Failed:', e.message));