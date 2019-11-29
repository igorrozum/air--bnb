const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')



router.post('/', (req, res) => {
    Room.find({$or:[{city: { $regex : new RegExp(req.body.search, "i") }},
                    {title:{ $regex : new RegExp(req.body.search, "i") }},
                    {address:{ $regex : new RegExp(req.body.search, "i") }},
                    {description:{ $regex : new RegExp(req.body.search, "i") }}]})
    .then(rooms => {
        res.render('listings', {
            rooms: rooms
        })
    })
    
})



module.exports = router