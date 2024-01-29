const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const mockingModule = require('./src/mockingModule');
const customErrorDictionary = require('./src/customErrorDictionary');
const { UserDAO, PremiumUserDAO } = require('./src/dao/factory');
const bcrypt = require('bcrypt');
const app = express();
const port = 8080;

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: 'your-github-client-id',
      clientSecret: 'your-github-client-secret',
      callbackURL: 'http://localhost:8080/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ username: profile.username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          const newUser = new User({
            username: profile.username,
            password: 'generated-password',
            role: 'user',
          });
          newUser.save((err, savedUser) => {
            if (err) {
              return done(err);
            }
            return done(null, savedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./src/routes/auth');

app.use('/auth', authRouter);
app.get('/mockingproducts', (req, res) => {
  const mockedProducts = mockingModule.generateMockProducts();
  res.json(mockedProducts);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = customErrorDictionary[err.type] || 'Internal Server Error';
  res.status(status).json({ error: message });
});

module.exports = app;
