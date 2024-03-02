
const Product = require('../models/Product');
const Inventory = require("../models/Inventory");

const getProductsByBarcode = async(req, res) => {
    const id = req.params.id;
    try {
        
        if (typeof id == "undefined") {
            return res.status(400).json({ error: 'Barcode ID is missing' });
        }

        const productResults = await Product.find({ barcodeNumber: id }).exec(); 
        const inventoryResults = await Inventory.find({ barcodeNumber: id }).exec();
       
        res.status(200).json({
            productResults,
            inventoryResults
        });

    } catch(error) {
        return res.status(500).json(error.message);
    };
   
}

module.exports = {getProductsByBarcode};