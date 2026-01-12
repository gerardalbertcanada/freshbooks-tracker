const { CLIENT_ID, SITE_URL } = require('./config');

module.exports = (req, res) => {
  const authUrl = new URL('https://auth.freshbooks.com/oauth/authorize/');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${SITE_URL}/api/callback`);
  authUrl.searchParams.set('scope', 'user:profile:read user:projects:read user:time_entries:read user:bills:read user:billable_items:read user:business:read user:reports:read');

  res.redirect(302, authUrl.toString());
};
