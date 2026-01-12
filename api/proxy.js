module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the path - it may be URL encoded
  let path = req.query.path;
  
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Decode the path if it's encoded
  try {
    path = decodeURIComponent(path);
  } catch (e) {
    // Already decoded, use as-is
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  try {
    const baseUrl = 'https://api.freshbooks.com';
    const fullUrl = `${baseUrl}${path}`;
    
    console.log('Proxying to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
};
