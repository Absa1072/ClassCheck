

const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'docs')));

//new code
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'mPurOLtaLvYeN1LyD9pT07HQs7cIufFV0iejj48xUnMzjw26jy4ErCsromQY8oVQ',
  baseURL: 'http://localhost:3000/docs',
  clientID: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
  issuerBaseURL: 'https://dev-csb64xqu8rysh5zp.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
//new code


app.get('/token', async (req, res) => {
  const code = req.query.code
  const role = req.query.state; // "student" or "professor"

  if (!code) {
    return res.status(400).send("Missing code from Auth0.");
  }

  const payload = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
    client_secret: 'mPurOLtaLvYeN1LyD9pT07HQs7cIufFV0iejj48xUnMzjw26jy4ErCsromQY8oVQ',
    code: code,
    redirect_uri: 'http://localhost:3000/token'
  });

  try {
    const response = await fetch('https://dev-csb64xqu8rysh5zp.us.auth0.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload
    });

    const data = await response.json();
    res.json(data);

    if (response.ok) {
      res.redirect(`/docs/index.html?token=${data.access_token}`);
    } else {
      res.status(500).send("Token exchange failed: " + JSON.stringify(data));
    }

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.get('/login', (req, res) => {
  const redirectUrl =
    "https://dev-csb64xqu8rysh5zp.us.auth0.com/authorize" +
    "?response_type=code" +
    "&client_id=VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE" +
    "&redirect_uri=http://localhost:3000/docs/index.html" +
    "&scope=offline_access openid profile email" +
    "&audience=https://apiclasscheck.com/api/signup";

  res.redirect(redirectUrl);
});

//const port = process.env.PORT || 3000;
