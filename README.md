# Project Hours Tracker

Compare **Actual Hours** (from FreshBooks) with **Estimated Hours** (from Google Sheets) — with automatic OAuth login.

---

## 🚀 Quick Deploy to Netlify (Free Plan)

### Step 1: Create a FreshBooks App

1. Log into FreshBooks
2. Go to **Settings** → **Developer Portal** (or visit `https://my.freshbooks.com/#/developer`)
3. Click **Create an App**
4. Fill in:
   - **App Name**: `Project Hours Tracker`
   - **Redirect URI**: `https://example.netlify.app/.netlify/functions/callback`  
     *(You'll update this after deploying)*
5. Click **Save**
6. Copy your **Client ID** and **Client Secret**

---

### Step 2: Configure Your Credentials

Open the file `netlify/functions/config.js` and update it:

```javascript
module.exports = {
  FRESHBOOKS_CLIENT_ID: 'your_actual_client_id_here',
  FRESHBOOKS_CLIENT_SECRET: 'your_actual_client_secret_here',
  SITE_URL: 'https://your-site-name.netlify.app'
};
```

**⚠️ Important:** Leave `SITE_URL` as a placeholder for now — you'll update it after deploying.

---

### Step 3: Deploy to Netlify

**Option A: Drag & Drop**
1. Unzip the project folder
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the entire folder onto the page
4. Wait for deployment to complete
5. Note your site URL (e.g., `https://amazing-app-12345.netlify.app`)

**Option B: Via GitHub**
1. Push this code to a GitHub repository
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect your repo and deploy

---

### Step 4: Update URLs

Now that you have your Netlify URL:

1. **Update `config.js`**:
   ```javascript
   SITE_URL: 'https://your-actual-site.netlify.app'
   ```

2. **Update FreshBooks App**:
   - Go back to FreshBooks Developer Portal
   - Edit your app
   - Change **Redirect URI** to:
     ```
     https://your-actual-site.netlify.app/.netlify/functions/callback
     ```
   - Save

3. **Redeploy** your site:
   - If using drag & drop: drag the updated folder again
   - If using GitHub: push your changes

---

### Step 5: Set Up Google Sheets

1. Create a Google Sheet with two columns:

| Project Name | Estimated Hours |
|--------------|-----------------|
| Website Redesign | 60 |
| Mobile App | 200 |
| API Integration | 40 |

2. **Project names must exactly match** your FreshBooks project names

3. **Publish to web**:
   - **File** → **Share** → **Publish to web**
   - Select your sheet
   - Choose **Comma-separated values (.csv)**
   - Click **Publish**

4. In the app, click **Settings** and paste your Google Sheets URL

---

## ✅ You're Done!

Visit your Netlify URL, click **Login with FreshBooks**, and you're in!

---

## Project Structure

```
freshbooks-tracker/
├── public/
│   └── index.html              # Main app
├── netlify/
│   └── functions/
│       ├── config.js           # ← YOUR CREDENTIALS GO HERE
│       ├── auth.js             # Starts OAuth flow
│       ├── callback.js         # Handles OAuth callback
│       ├── refresh.js          # Refreshes tokens
│       └── api.js              # Proxies API calls
├── netlify.toml                # Netlify config
└── README.md
```

---

## Troubleshooting

### "Login failed" or redirect error
- Make sure `SITE_URL` in config.js matches your Netlify URL exactly
- Make sure the Redirect URI in FreshBooks matches: `https://your-site.netlify.app/.netlify/functions/callback`
- Check for typos in Client ID / Client Secret

### No projects showing
- Check that you have projects in FreshBooks
- Open browser console (F12) to see any errors

### Estimated hours not showing
- Make sure Google Sheet is published to web
- Project names must match FreshBooks exactly (case-sensitive)

---

## Security Note

Since credentials are in the config file, they're part of your deployed code. The serverless functions run server-side so they're not visible in the browser, but:

- Don't share your deployed code publicly with credentials included
- If you upgrade to a paid Netlify plan later, you can move credentials to environment variables

---

## License

MIT
