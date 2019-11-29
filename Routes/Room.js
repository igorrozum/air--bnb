const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')


router.get('/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        if (room)
            res.render('room', {
                title: room.title,
                room: room
            })
        
    })
    .catch(err => console.log('Room search failed'))
})

module.exports = router


