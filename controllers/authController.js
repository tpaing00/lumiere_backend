User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const setSignUp = async(req, res) => {

    const { email, password } = req.body;

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(409).send('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User(
        {
            ...req.body,
            password: hashedPassword,
        }
    );
    user
      .save()
      .then((result) => {
        const urlStr = `/api/v1/signup/${result.id}`;
        // Set content-location header
        res.set("content-location", urlStr);
        res.status(201).json({
          url: urlStr,
          data: result,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  };

  module.exports = { setSignUp };