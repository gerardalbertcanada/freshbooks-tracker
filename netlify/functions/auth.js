// Redirects user to FreshBooks OAuth authorization page
const config = require('./config');

exports.handler = async (event, context) => {
  const clientId = config.FRESHBOOKS_CLIENT_ID;
  const redirectUri = config.SITE_URL + '/.netlify/functions/callback';
  
  if (!clientId || clientId === 'PASTE_YOUR_CLIENT_ID_HERE') {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Please configure FRESHBOOKS_CLIENT_ID in netlify/functions/config.js' })
    };
  }

  const authUrl = `https://auth.freshbooks.com/oauth/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    }
  };
};
