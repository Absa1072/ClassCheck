const express = require('express');
const app = express();

app.get('/login', (req, res) => {
  const redirectUrl =
    "https://dev-csb64xqu8rysh5zp.us.auth0.com/authorize" +
    "?response_type=code" +
    "&client_id=VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE" +
    "&redirect_uri=http://localhost:3000/docs" +
    "&scope=offline_access openid profile email" +
    "&audience=https://apiclasscheck.com/api/signup";

  res.redirect(redirectUrl);
});



app.get('/token', async (req, res) => {
  const code = req.query.code;
  const role = req.query.state; // "student" or "professor"

  const payload = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
    client_secret: 'mPurOLtaLvYeN1LyD9pT07HQs7cIufFV0iejj48xUnMzjw26jy4ErCsromQY8oVQ',
    code: code,
    redirect_uri: 'http://localhost:3000/docs'
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
    //res.json(data);
    const accessToken = data.access_token;
    res.redirect(`/docs?token=${accessToken}`);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

