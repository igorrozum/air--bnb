const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')

router.post('/', (req, res) => {
    // Room.find({city: req.body.cityToSearch})
    Room.find({city: { $regex : new RegExp(req.body.cityToSearch, "i") }})
    .then(rooms => {
        res.render('listings', {
            rooms: rooms
        })
    })
    
})




module.exports = router