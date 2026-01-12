module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const authHeader = req.headers.authorization;

  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  try {
    // Determine the base URL based on the path
    let baseUrl = 'https://api.freshbooks.com';
    
    const response = await fetch(`${baseUrl}${path}`, {
      method: req.method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
