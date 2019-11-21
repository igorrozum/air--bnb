const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const roomSchema = new Schema({
    title: {type: String, required: false},
    description: {type: String, required: false},
    address: {type: String, required: false},
    country: {type: String, required: false},
    state: {type: String, required: false},
    city: {type: String, required: false},
    postalCode: {type: String, required: false},
    price: {type: Number, required: false},
    roomPic: {type: String, required: false},
    user: {type: String, required: true}
})


const roomModel = mongoose.model('Rooms', roomSchema)

module.exports = roomModel