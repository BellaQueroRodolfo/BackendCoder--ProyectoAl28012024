const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserDTO = require('../../dao/dto/UserDTO');
const { authorizeUser, authenticateUser } = require('../../middlewares/auth');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const userDTO = new UserDTO(user);
      return res.status(200).json({ user: userDTO });
    });
  })(req, res, next);
});

router.post('/logout', authorizeUser, (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});


router.get('/check', authenticateUser, (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({ user: userDTO });
});

module.exports = router;
