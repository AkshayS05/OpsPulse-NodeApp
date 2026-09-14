require('dotenv').config();
const {getToken} = require('./auth');

(async () => {
    const token = await getToken();
    console.log('Token:', token.substring(0, 50) + '...');
    const res = await fetch(`${process.env.DATAVERSE_URL}/api/data/v9.2/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
           
        }
    });
    const data = await res.json();
   console.log(data.value.filter(t => t.name.startsWith('ops_')));
})();