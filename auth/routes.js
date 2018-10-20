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
  res.redirect("https://toomanylists.com/");
});

//facebook login
router.get("/facebook", passport.authenticate("facebook"));

//callback for facebook redirect
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("https://toomanylists.com/");
  }
);

//auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("https://toomanylists.com/");
});

//FOR TESTING PURPOSES____________________________
// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//   res.redirect("http://localhost:3000");
// });

// router.get("/facebook", passport.authenticate("facebook"));

// router.get(
//   "/facebook/redirect",
//   passport.authenticate("facebook"),
//   (req, res) => {
//     res.redirect("http://localhost:3000");
//   }
// );

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("http://localhost:3000");
// });
//FOR TESTING PURPOSES____________________________

module.exports = router;
