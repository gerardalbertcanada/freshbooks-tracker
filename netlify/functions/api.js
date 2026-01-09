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

  // Get the API path from query string
  const apiPath = event.queryStringParameters?.path;
  
  if (!apiPath) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API path required' })
    };
  }

  // Validate the path starts with allowed endpoints
  const allowedPrefixes = ['/auth/api/v1/', '/projects/business/', '/accounting/account/'];
  const isAllowed = allowedPrefixes.some(prefix => apiPath.startsWith(prefix));
  
  if (!isAllowed) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API path not allowed' })
    };
  }

  try {
    const url = `https://api.freshbooks.com${apiPath}`;
    
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Api-Version': 'alpha'
      },
      body: event.httpMethod !== 'GET' ? event.body : undefined
    });

    const data = await response.text();
    
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
      body: JSON.stringify({ error: 'Failed to fetch from FreshBooks API' })
    };
  }
};
