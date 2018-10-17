//require("dotenv").config();
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
app.use(
  cors({
    origin: "http://ilikelists.com.s3-website.us-east-2.amazonaws.com",
    credentials: true
  })
);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("http://ilikelists.com.s3-website.us-east-2.amazonaws.com");
  } else {
    next();
  }
};

app.use(
  "/graphql",
  authCheck,
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

let PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Now listening for requests on port" + PORT);
});
