//require("dotenv").config(); //FOR TESTING PURPOSES____________________________
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth/routes");
require("./auth/passport-setup");
const passport = require("passport");
const cookieSession = require("cookie-session");

const app = express();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up routes
app.use("/auth", authRoutes);

//allow cross origin requests
const whitelist = [
  "https://d9hu6u8b2wnsv.cloudfront.net/",
  "https://toomanylists.com/"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
// FOR TESTING PURPOSES____________________________
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true
//   })
// );
//FOR TESTING PURPOSES____________________________

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("https://toomanylists.com/");
  } else {
    next();
  }
};
//FOR TESTING PURPOSES____________________________
// const authCheck = (req, res, next) => {
//   if (!req.user) {
//     res.redirect("http://localhost:3000");
//   } else {
//     next();
//   }
// };
//FOR TESTING PURPOSES____________________________
app.use(
  "/graphql",
  authCheck,
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Now listening for requests on port" + PORT);
});
