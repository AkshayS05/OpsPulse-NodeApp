require('dotenv').config();
const { dvGet } = require('./dataverse');

(async () => {
    try {
        const data = await dvGet('ops_incidents?$top=1');
        console.log('Data:', data);
    }
    catch (e) {
        console.error('Failed:', e.message);
    }   
})();