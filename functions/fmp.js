const https = require('https');

exports.handler = async function(event) {
  const { path, params } = event.queryStringParameters || {};
  if (!path) return {
    statusCode: 400,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Missing path' })
  };

  const API_KEY = '3qLgVVA3vd6OdJ80n1fC4v1OMPJPQ5ZV';
  const queryString = params ? `${params}&apikey=${API_KEY}` : `apikey=${API_KEY}`;
  const url = `https://financialmodelingprep.com/stable/${path}?${queryString}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch(e) { parsed = data; }
        if(parsed && parsed['Error Message']) {
          resolve({ statusCode: 403, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ error: parsed['Error Message'] }) });
          return;
        }
        resolve({ statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: data });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: e.message }) });
    });
  });
};
