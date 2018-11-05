const router = require("express").Router();
const passport = require("passport");
var parser = require("body-parser");
var jsonParser = parser.json();

//local login
router.post(
  "/login",
  jsonParser,
  passport.authenticate("user-login"),
  (req, res) => {
    res.send(req.user);
  }
);
router.post(
  "/register",
  jsonParser,
  passport.authenticate("new-user"),
  (req, res) => {
    res.send(req.user);
  }
);

//google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("https://toomanylists.com/");
  // res.redirect("http://192.168.0.8:3000");
});

//facebook login
router.get("/facebook", passport.authenticate("facebook"));

//callback for facebook redirect
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("https://toomanylists.com/");
    // res.redirect("http://192.168.0.8:3000");
  }
);

//auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
