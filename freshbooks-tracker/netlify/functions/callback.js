// Handles OAuth callback from FreshBooks and exchanges code for tokens
const config = require('./config');

exports.handler = async (event, context) => {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 302,
      headers: {
        Location: `${config.SITE_URL}?error=${encodeURIComponent(error)}`
      }
    };
  }

  if (!code) {
    return {
      statusCode: 302,
      headers: {
        Location: `${config.SITE_URL}?error=no_code`
      }
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
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      return {
        statusCode: 302,
        headers: {
          Location: `${config.SITE_URL}?error=token_exchange_failed`
        }
      };
    }

    const data = await response.json();
    
    // Redirect back to app with tokens in hash (client-side only)
    const params = new URLSearchParams({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in || 43200
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${config.SITE_URL}#${params.toString()}`
      }
    };
  } catch (err) {
    console.error('OAuth callback error:', err);
    return {
      statusCode: 302,
      headers: {
        Location: `${config.SITE_URL}?error=server_error`
      }
    };
  }
};
