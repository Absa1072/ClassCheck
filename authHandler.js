const axios = require('axios');

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const connection = process.env.AUTH0_CONNECTION;

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, netID } = req.body;
    const response = await axios.post(`https://${domain}/dbconnections/signup`, {
      client_id: clientId,
      email,
      password,
      connection,

      user_metadata: {
        firstName,
        lastName,
        netID,
      }
    });
    res.status(201).json({ message: "You successfully created an account.", data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.response.data || error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post(`https://${domain}/oauth/token`, {
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      username: email,
      password,
      audience: '',
      scope: 'openid profile email',
      client_id: clientId,
      client_secret: clientSecret,
      realm: connection
    });

    res.status(200).json({ token: response.data.access_token });
  } catch (error) {
    res.status(401).json({ error: error.response.data || error.message });
  }
};
