const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')
const User = require('../Models/User')
const fileupload = require("express-fileupload");
const methodOverride = require('method-override')
const path = require('path')
const rimraf = require("rimraf")


router.use(fileupload())
router.use(methodOverride('_method'))


router.get('/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        if (room)
            res.render('room', {
                title: room.title,
                room: room
            })
        
    })
    .catch(err => console.log(`Room search failed ${err}`))
})


router.post('/:roomId', (req, res) => {
    let checkinError = "";
    let checkoutError = "";
    let datesError = "";
    const curDate = new Date().setHours(0, 0, 0, 0);
    const checkinDate = new Date(req.body.checkinDate);
    const checkoutDate = new Date(req.body.checkoutDate);

    if (req.body.checkinDate == "" || checkinDate.toString() == "Invalid Date")
        checkinError = "Enter correct Check-in date";
    else if (checkinDate < curDate)
        checkinError = "Date can't be lower than today";

    if (req.body.checkoutDate == "" || checkoutDate.toString() == "Invalid Date")
        checkoutError = "Enter correct Check-out date";
    else if (checkoutDate < curDate)
        checkoutError = "Date can't be lower than today";

    if (checkinDate > checkoutDate)
        datesError = "Check-out date can't be before check-in date"

    if (checkinError || checkoutError || datesError) {
        Room.findById(req.params.roomId)
        .then(room => {
            if (room)
                res.render("room", {
                    title: room.title,
                    room: room,
                    checkinError : checkinError,
                    checkoutError : checkoutError,
                    datesError : datesError
                })
        })
        .catch(err => console.log(`Room search failed ${err}`))
    } else {
        User.findById(req.session.userInfo._id)
        .then(user => {
            // if (user) {
            //     user.bookedRooms.push({roomId: req.params.roomId, checkIn: checkinDate, checkOut: checkoutDate})
                
            //     // user.save()
            //     // .then(() => res.redirect(`/room/${req.params.roomId}`))
            //     // .catch(err => console.log(`Booking wasn't saved: ${err}`))
            //     res.redirect(`/room/${req.params.roomId}`) 
            // }
            if (user) {
                user.updateOne({$push: {bookedRooms: {roomId: req.params.roomId, checkIn: checkinDate, checkOut: checkoutDate}}})
                .then(() => res.redirect(`/room/${req.params.roomId}`))
                .catch(err => console.log(`Booking wasn't saved: ${err}`))
            } else {
                res.redirect(`/room/${req.params.roomId}`)
            }
        })
    }
})


router.get('/edit/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        res.render('roomEdit', {
            title: room.title,
            room : room
        })
    })
    .catch(err => console.log(`Room search failed ${err}`))
})


router.put('/edit/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        if (room) {
            room.title = req.body.title
            room.description = req.body.description,
            room.address = req.body.address,
            room.country = req.body.country,
            room.state = req.body.state,
            room.city = req.body.city,
            room.postalCode = req.body.postalCode,
            room.price = req.body.price

            if (req.files) {
                req.files.picture.name = `roomPhoto${path.parse(req.files.picture.name).ext}`
                console.log("got here 2")
                req.files.picture.mv(`./public/uploads/rooms/${room.user}/${room.title}/${req.files.picture.name}`)
            }
            room.save()
            .then(() => console.log("Room has been updated"))
            .catch(err => console.log(`Room has been updated ${err}`))
        }
        res.redirect('/dashboard')
    })
    .catch(err => console.log(`Room search failed ${err}`))
})


router.delete('/delete/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        console.log(room)
        rimraf(`./public/uploads/rooms/${room.user}/${room.title}/`, function(err) {
            if (err)
                console.log(`Error in deleting picture: ${err}`)
        })
        Room.deleteOne({_id: room._id})
        .then(() => console.log("Room deleted"))
        .catch(err => console.log(`Room wasn't deleted ${err}`))
        res.redirect('/dashboard')
    })
    .catch(err => console.log(`Something went wrong: ${err}`))
    
})


module.exports = router


