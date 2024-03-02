
const InternalUse = require("../models/InternalUse");

const getInternalUseList = async(req, res) => {
    const id = req.params.id;
    try {
        if (typeof id == "undefined") {
            return res.status(400).json({ error: 'Inventory ID is missing' });
        }
        const InternalUseListResults = await InternalUse.find({ inventoryId: id }).exec();
       
        res.status(200).json({InternalUseListResults});

    } catch(error) {
        return res.status(500).json(error.message);
    };
}
module.exports = {getInternalUseList};