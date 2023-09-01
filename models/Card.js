const mongoose = require('mongoose');

const flashCardSchema = new mongoose.Schema({
    user: {       //User who is ordering
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    cardrId: {
        type: String,
        unique: true
    },
    sharedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]
});
module.exports = mongoose.model('flashcards', flashCardSchema);