const Card = require('../models/Card')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const uid = require('uid')

//Add new card
app.post('/createcard', async (req, res) => {
    try {
        if (req.body.question && req.body.answer && req.body.category) {
            let data = req.body;
            data.cardId = uid(8);
            const doc = await Card.create(data);

            const populatedCard = await Card.populate(doc, [
                {
                    path: 'user',
                    model: 'users'
                }
            ]);

            res.json(handleSuccess(populatedCard));
        }
        else {
            return res.json(handleErr('Card data is required'))
        }
    } catch (err) {
        res.json(handleErr(err));
    }
});


//Get all cards for user
app.post('/getUserCards', async (req, res) => {
    try {
        if (req.body.user) {
            const docs = await Card.find({ user: req.body.user })
                .populate([
                    {
                        path: 'user',
                        model: 'users'
                    },
                    {
                        path: 'sharedUsers',
                        model: 'users'
                    }
                ])
                .sort({ createdDate: -1 })
                .exec();

            res.json(handleSuccess(docs));
        } else {
            res.json(handleErr('User can not be null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
});


//Share card with user
app.put('/sharecard', async (req, res) => {
    try {
        if (req.body.id && req.body.user) {       //check card _id and user id to whom card is being shared
            let { id, user } = req.body
            let updatedCard = await Card.findByIdAndUpdate(id, { $push: { sharedUsers: user } }, { new: true }).populate([
                {
                    path: 'user',
                    model: 'users'
                },
                {
                    path: 'sharedUsers',
                    model: 'users'
                }
            ])
                .exec();
            return res.json(handleSuccess(updatedCard))
        }
        else {
            res.json(handleErr('User and card can not be null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
})

//Delete card
app.delete('/deletecard', async (req, res) => {
    try {
        if (req.body.id) {       //check card _id and user id to whom card is being shared
            let { id } = req.body
            let deletedCard = await Card.findByIdAndDelete(id)
            return res.json(handleSuccess(deletedCard))
        }
        else {
            res.json(handleErr('Card can not be null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
})

//Get shared cards for user
app.get('/sharecards/:user', async (req, res) => {
    try {
        if (req.params.user) {       //check card _id and user id to whom card is being shared
            let { user } = req.params
            let sharedCards = await Card.find({ sharedUsers: user }).populate([
                {
                    path: 'user',
                    model: 'users'
                },
                {
                    path: 'sharedUsers',
                    model: 'users'
                }
            ])
                .exec();
            return res.json(handleSuccess(sharedCards))
        }
        else {
            res.json(handleErr('User can not be null'));
        }
    } catch (err) {
        res.json(handleErr(err));
    }
})


//Update card
app.put('/updateCard', async (req, res) => {
    try {
        if (req.body.id) {
            let { id } = req.body
            let updated = await Card.findByIdAndUpdate(id, req.body, { new: true }).populate([
                {
                    path: 'user',
                    model: 'users'
                },
                {
                    path: 'sharedUsers',
                    model: 'users'
                }
            ])
                .exec();
            if (updated !== null) {
                return res.json(handleSuccess(updated))
            } else {
                return res.json(handleErr('Invalid Card id'))
            }

        } else {
            return res.json(handleErr('Card is required'))
        }
    } catch (err) {
        res.json(handleErr(err));

    }
})
module.exports = app