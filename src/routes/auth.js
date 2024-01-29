const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { UserDAO } = require('../dao/factory');
const UserDTO = require('../dao/dto/UserDTO');

router.post('/login', passport.authenticate('local'), (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.status(200).json({ user: userDTO });
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDAO = new UserDAO();
    const newUser = await userDAO.createUser(username, hashedPassword);
    res.status(201).json({ user: new UserDTO(newUser) });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
