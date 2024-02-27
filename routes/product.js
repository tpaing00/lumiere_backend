const express = require('express');
const router = express.Router({mergeParams:true});


const productController = require('../controllers/productController');

// router.get("/inventory", inventoryCtrl.getInventory);
// router.post("/inventory", inventoryCtrl.saveInventory);

// Route for adding a product
router.get('/search', productController.searchProductList);
router.post('/add-product', productController.addProduct);
router.get('/products', productController.getProductList);
router.get('/products/:id', productController.getProductList);



module.exports = router;