const express = require('express');
const router = express.Router();
const { ProductDAO } = require('../../dao/factory');
const ProductDTO = require('../../dao/dto/ProductDTO');

router.get('/', async (req, res) => {
  try {
    const productDAO = new ProductDAO();
    const products = await productDAO.getAllProducts();
    res.json(products.map((product) => new ProductDTO(product)));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductDAO.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(new ProductDTO(product));
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
