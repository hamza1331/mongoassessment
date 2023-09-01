const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const crypto = require('crypto');
const emailKey = require('../constants/keys')['emailKey']
const passKey = require('../constants/keys')['passKey']
const User = require('../models/User')

//Create user
app.post('/signup', async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.fName) {
            const { email, password, fName } = req.body;
            if (email.length > 0 && password.length > 0) {
                const mykey = crypto.createCipher('aes-128-cbc', emailKey);
                let newEmail = mykey.update(email, 'utf8', 'hex');
                newEmail += mykey.final('hex');
                const myPasskey = crypto.createCipher('aes-128-cbc', passKey);
                let newPassword = myPasskey.update(password, 'utf8', 'hex');
                newPassword += myPasskey.final('hex');
                const data = {
                    email: newEmail,
                    password: newPassword,
                    fName
                };
                const newUser = await User.create(data);
                res.json(handleSuccess(newUser));
            } else {
                res.json(handleErr('Email, Full Name and Password are required'));
            }
        } else {
            res.json(handleErr('User can not be null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
});

//Login User
app.post('/login', async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            if (req.body.email.length > 0 && req.body.password.length > 0) {
                const data = req.body;
                const mykey = crypto.createCipher('aes-128-cbc', emailKey);
                let newEmail = mykey.update(data.email, 'utf8', 'hex');
                newEmail += mykey.final('hex');
                const myPasskey = crypto.createCipher('aes-128-cbc', passKey);
                let newPassword = myPasskey.update(data.password, 'utf8', 'hex');
                newPassword += myPasskey.final('hex');

                const user = await User.findOne({
                    email: newEmail,
                    password: newPassword
                });

                if (user !== null) {
                    res.json(handleSuccess(user));
                } else {
                    res.json(handleErr('Unauthorized login'));
                }
            } else {
                res.json(handleErr('Email and Password are required'));
            }
        } else {
            res.json(handleErr('Email and Password are null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
});


module.exports = app