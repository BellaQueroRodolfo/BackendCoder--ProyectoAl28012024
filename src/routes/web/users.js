const express = require('express');
const router = express.Router();
const { getUserDAO } = require('../../dao/factory');
const UserDTO = require('../../dao/dto/UserDTO');

router.post('/premium/:uid', async (req, res) => {
  const { uid } = req.params;
  const daoType = req.body.role === 'premium' ? 'premium' : 'user';
  try {
    const userDAO = getUserDAO(daoType);
    const user = await userDAO.upgradeDowngradeUser(uid);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
