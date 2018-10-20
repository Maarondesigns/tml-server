const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL:
        "https://mikes-reading-list.herokuapp.com/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENID,
      clientSecret: process.env.GOOGLE_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ googleId: profile.id }).then(currentUser => {
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        "https://mikes-reading-list.herokuapp.com/auth/facebook/redirect",
      profileFields: ["id", "email", "displayName", "photos"]
    },
    (accessToken, refreshToken, profile, done) => {
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
