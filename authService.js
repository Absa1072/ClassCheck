const createAuth0Client = require ("@auth0/auth0-spa-js");

async function getUserRole() {
    const createAuth0Client = require("@auth0/auth0-spa-js");
  
    const auth0 = await createAuth0Client({
      domain: "dev-csb64xqu8rysh5zp.us.auth0.com",
      client_id: "VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE"
    });

  await auth0.handleRedirectCallback();
  const user = await auth0.getUser();
  return user["https://classcheck.com/role"];
}
module.exports = { getUserRole };
