var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated());
    res.render("index", {
        title: "ClassCheck", 
        isAuthenticated: req.oidc.isAuthenticated(),
    });
});

router.get('/callback', (req, res) => {
    const returnTo = req.appSession?.returnTo || '/';
    res.redirect(returnTo);
});

module.exports = router;
