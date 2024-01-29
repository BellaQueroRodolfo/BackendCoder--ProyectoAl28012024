const express = require('express');
const router = express.Router();
const { CartDAO } = require('../../dao/factory');
const CartDTO = require('../../dao/dto/CartDTO');

router.get('/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const cartDAO = new CartDAO();
    const cart = await cartDAO.getCartByUserId(userId);
    res.json(new CartDTO(cart));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/:uid', async (req, res) => {
  const userId = req.params.uid;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  try {
    const cartDAO = new CartDAO();
    const updatedCart = await cartDAO.addProductToCart(userId, productId, quantity);
    res.json(new CartDTO(updatedCart));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
