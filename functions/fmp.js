const https = require('https');

exports.handler = async function(event) {
  const { endpoint } = event.queryStringParameters || {};
  if (!endpoint) return {
    statusCode: 400,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Missing endpoint' })
  };
  const API_KEY = '3qLgVVA3vd6OdJ80n1fC4v1OMPJPQ5ZV';
  const decodedEndpoint = decodeURIComponent(endpoint);
  const separator = decodedEndpoint.includes('?') ? '&' : '?';
  const url = `https://financialmodelingprep.com/stable/${decodedEndpoint}${separator}apikey=${API_KEY}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch(e) { parsed = data; }
        if(parsed && (parsed['Error Message'] || parsed.error)) {
          resolve({ statusCode: 403, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ error: parsed['Error Message'] || parsed.error }) });
          return;
        }
        resolve({ statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: data });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: e.message }) });
    });
  });
};
