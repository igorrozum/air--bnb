const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')
const User = require('../Models/User')
const middleware = require('../middleware/auth')
const isAuthenticated = middleware.isAuthenticated
const isAdmin = middleware.isAdmin
const fileupload = require("express-fileupload");
const methodOverride = require('method-override')
const path = require('path')
const rimraf = require("rimraf")


router.use(fileupload())
router.use(methodOverride('_method'))


router.get('/:roomId', (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        if (room) {
            let canEdit = false
            if (req.session.userInfo)
                if (req.session.userInfo._id == room.user)
                    canEdit = true

            res.render('room', {
                title: room.title,
                room: room,
                itsAdmin: canEdit
            })
        }
    })
    .catch(err => console.log(`Room search failed ${err}`))
})


router.post('/:roomId', isAuthenticated, (req, res) => {
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
        User.find()
        .then(users => {
            if (users) {
                let alreadyBookedRooms = []
                for (user of users) {
                    for (let i = 0; i < user.bookedRooms.length; i++) {
                        if ((checkinDate >= user.bookedRooms[i].checkIn && checkinDate < user.bookedRooms[i].checkOut) || (checkoutDate > user.bookedRooms[i].checkIn && checkoutDate <= user.bookedRooms[i].checkOut))
                            alreadyBookedRooms.push(JSON.stringify(user.bookedRooms[i].roomId))
                        else if (checkinDate <= user.bookedRooms[i].checkIn && checkoutDate >= user.bookedRooms[i].checkOut)
                            alreadyBookedRooms.push(JSON.stringify(user.bookedRooms[i].roomId))
                    }
                }
                let booked = false
                for (room of alreadyBookedRooms)
                    if (room === `"${req.params.roomId}"`) {
                        booked = true
                    }
                    
                if (booked) {
                    console.log('got here')
                    datesError = "The room is booked for these dates already"
                    Room.findById(req.params.roomId)
                    .then(room => {
                        res.render('room', {
                            title: room.title,
                            room: room,
                            datesError: datesError
                        })
                    })
                    .catch(err => console.log(`Room wasn't found: ${err}`))
                    
                } else {
                    User.findById(req.session.userInfo._id)
                    .then(user => {
                        if (user) {
                            user.updateOne({$push: {bookedRooms: {roomId: req.params.roomId, checkIn: checkinDate, checkOut: checkoutDate}}})
                            // .then(() => res.redirect(`/room/${req.params.roomId}`))
                            .then(() => res.redirect(`/dashboard`))
                            .catch(err => console.log(`Booking wasn't saved: ${err}`))
                        } else {
                            res.redirect(`/dashboard`)
                        }
                    })
                }
            }
        })


    }
})


router.get('/edit/:roomId', isAuthenticated, isAdmin, (req, res) => {
    Room.findById(req.params.roomId)
    .then(room => {
        res.render('roomEdit', {
            title: room.title,
            room : room
        })
    })
    .catch(err => console.log(`Room search failed ${err}`))
})


router.put('/edit/:roomId', isAuthenticated, isAdmin, (req, res) => {
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


router.delete('/delete/:roomId', isAuthenticated, isAdmin, (req, res) => {
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


