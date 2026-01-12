const { CLIENT_ID, CLIENT_SECRET, SITE_URL } = require('./config');

module.exports = async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(302, `${SITE_URL}?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(302, `${SITE_URL}?error=no_code`);
  }

  try {
    const tokenResponse = await fetch('https://api.freshbooks.com/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: `${SITE_URL}/api/callback`
      })
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return res.redirect(302, `${SITE_URL}?error=${encodeURIComponent(data.error)}`);
    }

    // Redirect to frontend with tokens in hash
    const redirectUrl = `${SITE_URL}/#access_token=${data.access_token}&refresh_token=${data.refresh_token}&expires_in=${data.expires_in}`;
    return res.redirect(302, redirectUrl);

  } catch (err) {
    return res.redirect(302, `${SITE_URL}?error=${encodeURIComponent(err.message)}`);
  }
};
