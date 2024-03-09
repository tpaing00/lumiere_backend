const User = require("../models/User");

const getUser = (req, res) => {
  const id = req.params.id;
  if (typeof id == "undefined") {
    User.find({})
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    User.findOne({ _id: id })
      .exec()
      .then((results) => {
        if (results == null) {
          res.status(404).json(results);
        } else {
          res.status(200).json(results);
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

module.exports = { getUser };
