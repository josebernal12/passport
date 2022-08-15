const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const routes = require("./routes/rutas.js");
const config = require("./config/config.js");
const controllersdb = require("./controllers/controller.js");
const User = require("./model/model.js");
const app = express();
const path = require('path')

const port = 3000;



app.use(express.static(path.join(__dirname, "./views")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "coderhouse",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: config.TIEMPO_EXPIRACION,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(reqPassword, hashedPassword) {
  return bcrypt.compareSync(reqPassword, hashedPassword);
}

const signupStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return done("User already exists", false);
      }

      const newUser = {
        username: username,
        password: hashPassword(password),

      }

      const createdUser = await User.create(newUser);

      return done(null, createdUser);
    } catch (err) {
      console.log(err);
      done(err);
    }
  }
);

const loginStrategy = new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });

  if (!user || !isValidPassword(password, user.password)) {
    return done("Invalid credentials", null);
  }

  return done(null, user);
});

passport.use("register", signupStrategy);
passport.use("login", loginStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

function checkauth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  }else{
    res.redirect('/login')
  }
}


app.get("/register", routes.getSignup);

app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failsignup" }),
  routes.postSignup
);

app.get("/failsignup", routes.getFailsignup);

app.get("/login", routes.getLogin);
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  routes.postLogin
)
app.get("/faillogin", routes.getFaillogin);

app.get('/logout', routes.getlogout);

app.get('/nombre' , (req,res)=>{
  const mensaje = User.username 
  res.json(mensaje)
})





controllersdb.conectarDB("mongodb://localhost:27017/passport", (err) => {
  if (err) return console.log("error en conexión de base de datos", err);
  console.log("BASE DE DATOS CONECTADA");

  app.listen(port, (err) => {
    if (err) return console.log("error en listen server", err);
    console.log(`Server running on port ${port}`);
  });

})