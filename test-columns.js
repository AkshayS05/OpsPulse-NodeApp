require('dotenv').config();
const { getToken } = require('./auth');

(async () => {
  const token = await getToken();

  const res = await fetch(
    `${process.env.DATAVERSE_URL}/api/data/v9.2/ops_incidents?$top=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    }
  });

  const data = await res.json();
  console.log(Object.keys(data.value[0]));
})();