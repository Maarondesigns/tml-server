const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  "user-login",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    function(req, username, password, done) {
      let findUser = {};
      if (req.body.email && username === "used email") {
        findUser = { email: req.body.email };
      } else {
        findUser = { username: username };
      }
      User.findOne(findUser, function(err, user) {
        console.log(user);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        }
        return done(null, false, { message: "Incorrect password." });
      });
    }
  )
);
passport.use(
  "new-user",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    function(req, username, password, done) {
      let findUser = {};
      if (req.body.email && username === "used email") {
        findUser = { email: req.body.email };
      } else {
        findUser = { username: username };
      }
      User.findOne(findUser, function(err, user) {
        console.log(user);
        if (err) {
          return done(err);
        }
        if (!user) {
          let hash = bcrypt.hashSync(password, salt);
          findUser.password = hash;
          new User(findUser)
            .save()
            .then(newUser => {
              console.log(newUser);
              done(null, newUser);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return done(null, false, { message: "User already exists." });
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      // callbackURL: "http://localhost:4000/auth/google/redirect",
      callbackURL:
        "https://mikes-reading-list.herokuapp.com/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENID,
      clientSecret: process.env.GOOGLE_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          let user = {};
          if (profile.displayName) user["username"] = profile.displayName;
          if (profile.id) user["googleId"] = profile.id;
          if (profile.emails) user["email"] = profile.emails[0].value;
          if (profile.photos) user["avatar"] = profile.photos[0].value;
          new User(user)
            .save()
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => {
              console.log(err, profile);
            });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      // callbackURL: "http://localhost:4000/auth/facebook/redirect",
      callbackURL:
        "https://mikes-reading-list.herokuapp.com/auth/facebook/redirect",
      profileFields: ["id", "email", "displayName", "photos"]
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ facebookId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          let user = {};
          if (profile.displayName) user["username"] = profile.displayName;
          if (profile.id) user["facebookId"] = profile.id;
          if (profile.emails) user["email"] = profile.emails[0].value;
          if (profile.photos) user["avatar"] = profile.photos[0].value;
          new User(user)
            .save()
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => {
              console.log(err, profile);
            });
        }
      });
    }
  )
);
