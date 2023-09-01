const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    fName: {
        type: String,
        required: [true, 'Full name is required']
    },
    blocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});
UserSchema.index({ name: 'text', 'fName': "text" })
module.exports = mongoose.model('users', UserSchema);