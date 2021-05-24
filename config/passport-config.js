const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById) {

  // Function to authenticate user, passed as an argument at passport.use() below
  const authenticateUser = async (email, password, done) => {

    const user = getUserByEmail(email);

    // If the user is NULL or not found
    if (!user) {
      return done(null, false, { message: 'No user with that email' })
    }
    // Find a user with password
    try {
      // If the password is correct
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      // If the password is incorrect
      } else {
        return done(null, false, { message: "Password incorrect" })
      }

    } catch (error) {
      console.log(error)
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id))
  });
}

module.exports = initialize;