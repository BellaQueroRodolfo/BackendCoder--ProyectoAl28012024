const express = require('express');
const router = express.Router();
const { CartDAO } = require('../../dao/factory');
const CartDTO = require('../../dao/dto/CartDTO');

router.get('/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const cartDAO = new CartDAO();
    const cart = await cartDAO.getCartByUserId(userId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json(new CartDTO(cart));
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/:uid/add/:pid', async (req, res) => {
  const { uid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cartDAO = new CartDAO();
    const updatedCart = await cartDAO.addProductToCart(uid, pid, quantity);
    res.json(new CartDTO(updatedCart));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
