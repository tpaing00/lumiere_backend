User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const setSignUp = async(req, res) => {

    const { email, password } = req.body;

    await User.findOne({ email })
        .exec()
        .then((results) => {
            res.status(409).send('Email already exists');
        })
        .catch((error) => {
            res.status(500).json(error);
        });
    
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User(
        {
            ...req.body,
            password: hashedPassword,
        }
    );
    await user
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

const getLogin = async(req, res) => {

    const { email, password } = req.body;

    await User.findOne({ email })
        .exec()
        .then(async(user) => {
            if (!user) {
                res.status(404).send('User not found');
            }
            await bcrypt.compare(password, user.password)
            .then(result => {
                if(!result) {
                    res.status(401).send('Incorrect password');
                }
                res.status(200).send("login successful");
            })
            .catch((error) => {
                console.error('Error comparing passwords:', error);
                res.status(500).json(error.message);
            });   
        })
};

  module.exports = {setSignUp, getLogin};