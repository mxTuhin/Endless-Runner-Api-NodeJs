const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    age: {
        type: Number
    },
    score: {
        type: Number
    },
    is_locked: {
        type: Boolean
    },
    staked_amount: {
        type: String
    },
    avatar: {
        type: String
    },
    device_details_hash: {
        type: String
    },
    device_ip: {
        type: String
    },
    reason: {
        type: String
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', dataSchema)