const express = require('express');
const bcrypt = require('bcryptjs');
const initializePassport = require('./config/passport-config');

const app = express();

let users = []

const PORT = process.env.PORT || 3001;

//// View engine
app.set("view engine", 'ejs');


//// Middleware
app.use(express.urlencoded({ extended: false }));


//// Routes
// Home
app.get('/', (req, res) => {
    res.render('index', {name: 'Bebek', });
});

// Login
app.get('/login', (req, res) => {
    res.render('login');
});

// Register
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
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

//// Start server
app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
})
