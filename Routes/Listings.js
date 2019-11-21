const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')


router.get("/", (req, res)=>{
    Room.find()
    .then(rooms => {
        res.render("listings", {
            title : "Room Listings - Airbnb",
            rooms: rooms
        });
    })
    .catch(err => console.log(`Room weren't fetched`))

    
});


module.exports = router