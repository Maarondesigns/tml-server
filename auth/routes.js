const router = require("express").Router();
const passport = require("passport");
var parser = require("body-parser");
var jsonParser = parser.json();

//local login
router.post("/login", jsonParser, (req, res, next) => {
  passport.authenticate("user-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(JSON.stringify(info));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).send(JSON.stringify(info));
    });
  })(req, res, next);
});

//local new user login
router.post("/register", jsonParser, (req, res, next) => {
  passport.authenticate("new-user", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(JSON.stringify(info));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).send(JSON.stringify(info));
    });
  })(req, res, next);
});

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
  // res.redirect("http://localhost:3000");
});

//facebook login
router.get("/facebook", passport.authenticate("facebook"));

//callback for facebook redirect
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("https://toomanylists.com/");
    // res.redirect("http://localhost:3000");
  }
);

//auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
