const Notification = require('../models/Notification');

const getNotification = async(req, res) => {
    const id = req.params.id;
  
    try {
      if(typeof(id) == 'undefined') {
          let results = await Notification.find({}).exec();
          if(results !== null) {
              res.status(200).json(results);
          }
      } else {
        let results = await Notification.find({inventoryId: id}).exec();
        if(results !== null) {
            res.status(200).json(results);
        }
      }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { getNotification }