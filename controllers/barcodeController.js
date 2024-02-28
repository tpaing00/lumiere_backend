
const Product = require('../models/Product');
Inventory = require("../models/Inventory");

const getProductsByBarcode = async(req, res) => {
    const id = req.params.id;
    try {
        
        if (typeof id == "undefined") {
            return res.status(400).json({ error: 'Barcode ID is missing' });
        }

        const productResults = await Product.find({ barcodeId: id }).exec(); 
        const inventoryResults = await Inventory.find({ barcodeId: id }).exec();
       
        res.status(200).json({
            productResults,
            inventoryResults
        });

    } catch(error) {
        return res.status(500).json(error.message);
    };
   
}

module.exports = {getProductsByBarcode};