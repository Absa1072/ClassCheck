const express = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');
const session = require("express-session");
const app = express();

app.use('/docs',express.static(path.join(__dirname, 'docs')));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'mPurOLtaLvYeN1LyD9pT07HQs7cIufFV0iejj48xUnMzjw26jy4ErCsromQY8oVQ',
  baseURL: 'http://localhost:3000',
  clientID: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
  issuerBaseURL: 'https://dev-csb64xqu8rysh5zp.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
//middleware
app.use(auth(config));

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/current-user', requiresAuth(), (req, res) => {
  const email = req.oidc.user.email;
  const netID = email.split('@')[0];
  req.json({netID});
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});



