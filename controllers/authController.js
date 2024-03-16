const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const setSignUp = async(req, res) => {

    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email }).exec();
        if (userExists) {
            return res.status(409).send('Email already exists');
        }

        const hashedPassword =  await bcrypt.hash(password, 10);

        let user = new User(
            {
                ...req.body,
                password: hashedPassword,
            }
        );

        const results = await user.save();
        if(results) {
            const urlStr = `/api/v1/signup/${results.id}`;
            res.set("content-location", urlStr);
             return res.status(201).json({
                url: urlStr,
                data: results,
            });
        }

    } catch(error) {
        res.status(500).json(error);
    };
}

const getLogin = async(req, res) => {

    const { email, password } = req.body;
    // console.log("reached:" +JSON.stringify(req.body));

    try{
        const user = await User.findOne({ email }).exec();
        if(!user) {
            return res.status(404).json({error : 'User not found'});
        }

        const results = await bcrypt.compare(password, user.password);

        if(!results) {
            return res.status(401).json({error :'Incorrect password'});
        }
        const token = jwt.sign({id :user._id}, process.env.JWT_SECRET_KEY,{expiresIn : '1d'});
        return res.status(200).json({ token ,firstName: user.firstName, photo:user.photo});

    } catch(error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json(error.message);
    }
}

const verifyToken = async(req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]; 
    console.log("reached:1" );
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    
    try {
        console.log(process.env.JWT_SECRET_KEY);
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }
            req.body.userId = decoded.id;
            req.locals = {
                userId: decoded.id // assuming decoded contains the token payload
            };
            // console.log("reached:" +JSON.stringify(req.body));
            // console.log("reached:" +decoded.id);
            
            
            const userExists = User.findOne({_id : decoded.id}).exec();
            if (userExists) {
                next();
            } else {
                return res.status(401).json({ message: 'User not found' });
            }
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {setSignUp, getLogin, verifyToken};