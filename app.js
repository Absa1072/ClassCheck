const express = require('express');
const path = require('path');
const app = express()
const { requiresAuth } = require('express-openid-connect');
const indexRouter = require("./routes/index.js");
const { auth } = require('express-openid-connect');
require('dotenv').config()

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,

    authorizationParams: {
        response_type: 'code',
        response_mode: 'query',
        scope: 'openid profile email'
      },


    routes: {
        login: false, // disables default login route so we can customize it
      },
    
      afterCallback: (req, res, session) => {
        const returnTo = req.query.returnTo || '/';
        session.returnTo = returnTo;
        return session;
      }
  };

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('docs'))
//middleware
app.use(auth(config));
app.use(express.static(path.join(__dirname, 'docs')));
app.use("/", indexRouter);
//test login
app.get('/login', (req, res) => {
    const { returnTo } = req.query;
    const redirectTo = returnTo || '/index.html';
    res.oidc.login({ returnTo: redirectTo });
  });

app.listen(3001, () => {
    console.log(`Server running at http://localhost:3001`);
  });