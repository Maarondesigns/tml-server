//require("dotenv").config(); //FOR TESTING PURPOSES____________________________
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth/routes");
require("./auth/passport-setup");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

store.on("connected", function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on("error", function(error) {
  assert.ifError(error);
  assert.ok(false);
});

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: true
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
);
// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.COOKIE_KEY]
//   })
// );

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//allow cross origin requests
const whitelist = ["https://toomanylists.com", "https://www.toomanylists.com"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // origin: "http://192.168.0.8:3000",
    credentials: true
  })
);

//set up routes
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("https://toomanylists.com");
    // res.redirect("http://192.168.0.8:3000");
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

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Now listening for requests on port" + PORT);
});
