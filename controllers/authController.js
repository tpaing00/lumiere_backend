User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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

    try{
        const user = await User.findOne({ email }).exec();
        if(!user) {
            return res.status(404).json({error : 'User not found'});
        }

        const results = await bcrypt.compare(password, user.password);

        if(!results) {
            return res.status(401).json({error :'Incorrect password'});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        return res.status(200).json({ token });

    } catch(error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json(error.message);
    }
}

const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user = decoded; 
        console.log(user);
        // User.findById(decoded.userId, (err, user) => {
        //     if (err || !user) {
        //         return res.status(401).json({ message: 'User not found' });
        //     }
            next();
        // });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

}

module.exports = {setSignUp, getLogin, verifyToken};