const router = require("express").Router();
const passport = require("passport");

//google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.redirect("http://ilikelists.com.s3-website.us-east-2.amazonaws.com/home");
});

//facebook login
router.get("/facebook", passport.authenticate("facebook"));

//callback for facebook redirect
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect(
      "http://ilikelists.com.s3-website.us-east-2.amazonaws.com/home"
    );
  }
);

//auth logout
router.get("/logout", (req, res) => {
  //handle with passport
  req.logout();
  res.redirect("http://ilikelists.com.s3-website.us-east-2.amazonaws.com/");
});

module.exports = router;
