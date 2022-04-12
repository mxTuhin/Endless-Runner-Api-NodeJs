const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
        username: {
            type: String
        },
        score: {
            type: Number
        },
        device_details_hash: {
            type: String
        },
        device_ip: {
            type: String
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Score', dataSchema)