// Proxies requests to FreshBooks API to bypass CORS restrictions
exports.handler = async (event, context) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  
  if (!authHeader) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Authorization header required' })
    };
  }

  const apiPath = event.queryStringParameters?.path;
  
  if (!apiPath) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API path required' })
    };
  }

  try {
    const url = `https://api.freshbooks.com${apiPath}`;
    
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: event.httpMethod !== 'GET' ? event.body : undefined
    });

    const data = await response.text();
    
    // Return the actual status and response from FreshBooks
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (err) {
    console.error('API proxy error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
