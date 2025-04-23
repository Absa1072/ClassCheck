const payload = {
    client_id: "6TOCeRy2oV7wjPh7jL7w8Vklat6rw8Is",
    client_secret: "iPmaxfUER-nM46MLjt2SPd9lVIXmmlg_efEQ-FT0LUgNv5bGr6up9aeDfugRuigJ",
    audience: "https://apiclasscheck.com/api/signup",
    grant_type: "client_credentials",
  };
  
  fetch("https://dev-csb64xqu8rysh5zp.us.auth0.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("Error:", err));