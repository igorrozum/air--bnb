const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')



router.post('/', (req, res) => {
    Room.find({$or:[{city: { $regex : new RegExp(req.body.cityToSearch, "i") }},
                    {title:{ $regex : new RegExp(req.body.cityToSearch, "i") }},
                    {address:{ $regex : new RegExp(req.body.cityToSearch, "i") }},
                    {description:{ $regex : new RegExp(req.body.cityToSearch, "i") }}]})
    .then(rooms => {
        res.render('listings', {
            rooms: rooms
        })
    })
    
})



module.exports = router