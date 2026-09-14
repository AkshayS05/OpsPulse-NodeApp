let cachedToken = null;
let expiresAt= 0; 

async function getToken() {
if (cachedToken && Date.now() < expiresAt) {
    return cachedToken; 
  }

  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: `${process.env.DATAVERSE_URL}/.default`
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  const data = await res.json();                    // ← this was missing
  if (!data.access_token) throw new Error(JSON.stringify(data));  // ← and this

  cachedToken = data.access_token;
  expiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken;
}

module.exports = { getToken };