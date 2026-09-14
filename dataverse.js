const { getToken } = require( "./auth" );

async function dvGet(path) {
    const token = await getToken();

    const res = await fetch (`${process.env.DATAVERSE_URL}/api/data/v9.2/${path}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Prefer': 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
        }
    });

if(!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);

const data = await res.json();

    return data.value;
}
module.exports = { dvGet };

async function dvPost(path,data) {
    const token = await getToken();

    const res = await fetch (`${process.env.DATAVERSE_URL}/api/data/v9.2/${path}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Prefer': 'return=representation'
        },  
        body: JSON.stringify(data)
    });

 if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
return await res.json();
}
 
module.exports = { dvGet, dvPost };