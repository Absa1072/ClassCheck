const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();

app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'YOUR_SECRET_HERE', // Replace with a strong secret or use env
  baseURL: 'http://localhost:3000',
  clientID: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
  issuerBaseURL: 'https://dev-csb64xqu8rysh5zp.us.auth0.com'
};

// middleware
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// get netID
app.get('/current-user', requiresAuth(), (req, res) => {
  const email = req.oidc.user?.email || '';
  const netID = email.split('@')[0];
  res.json({ netID });
});

app.get('/myClasses', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/myClasses.html'));
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});






