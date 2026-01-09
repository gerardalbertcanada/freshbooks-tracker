// Refreshes an expired access token using the refresh token
const config = require('./config');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { refresh_token } = JSON.parse(event.body || '{}');

  if (!refresh_token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'refresh_token required' })
    };
  }

  const clientId = config.FRESHBOOKS_CLIENT_ID;
  const clientSecret = config.FRESHBOOKS_CLIENT_SECRET;
  const redirectUri = config.SITE_URL + '/.netlify/functions/callback';

  try {
    const response = await fetch('https://api.freshbooks.com/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token refresh failed:', errorText);
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Token refresh failed' })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in || 43200
      })
    };
  } catch (err) {
    console.error('Refresh error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
