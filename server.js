if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3001;

const initializePassport = require('./config/passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

let users = []

//// View engine
app.set("view engine", 'ejs');

//// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//// Routes
// Home
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { name: req.user.name });
});

// Login
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Register
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
});
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch (error) {
    console.log(error)
    res.redirect('/register')
  }
  console.log(users)
});

// Logout
app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

// Check if the user is already authenticated, if not, redirect to /login first
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Redirect to "/" if the user is already authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/")
  } else {
    return next();
  }
}

//// Start server
app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
})
