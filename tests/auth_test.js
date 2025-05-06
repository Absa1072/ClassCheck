// authService.js
import createAuth0Client from "@auth0/auth0-spa-js";

export async function getUserRole() {
  const auth0 = await createAuth0Client({
    domain: "dev-csb64xqu8rysh5zp.us.auth0.com",
    client_id: "VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE"
  });

  await auth0.handleRedirectCallback();
  const user = await auth0.getUser();
  return user["https://classcheck.com/role"];
}
