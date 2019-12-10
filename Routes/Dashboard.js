const express = require('express')
const router = express.Router()
const middleware = require('../middleware/auth')
const isAuthenticated = middleware.isAuthenticated
const isAdmin = middleware.isAdmin
const Room = require('../Models/Room')
const User = require('../Models/User')
const path = require('path')
const fileupload = require("express-fileupload");
const methodOverride = require('method-override')
const fs = require('fs');


router.use(fileupload())
router.use(methodOverride('_method'))


router.get('/', isAuthenticated, (req, res) => {
    if (req.session.userInfo.admin)
        Room.find({user: req.session.userInfo._id})
        .then(rooms => {
            res.render('adminDashboard', {
                title: `${req.session.userInfo.fname}'s Dashboard`,
                rooms: rooms
            })
        })
    else {
        const rooms = []
        User.findById(req.session.userInfo._id)
        .then(user => {
            for (booking of user.bookedRooms)
                rooms.push(booking.roomId)

            Room.find({'_id': {$in: rooms}})
            .then(rooms => {
                if (rooms) {
                    User.findById(req.session.userInfo._id)
                    .then(user => {
                        let bookings = []
                        for (booking of user.bookedRooms) {
                            for (room of rooms) {
                                if(JSON.stringify(room._id) == JSON.stringify(booking.roomId) && new Date(booking.checkOut).getTime() > new Date().getTime()) {
                                    bookings.push({room: room, booking: booking, checkIn: JSON.stringify(booking.checkIn).substr(1,10), checkOut: JSON.stringify(booking.checkOut).substr(1,10)})
                                }
                            }
                        }
                        res.render('userDashboard', {
                            title: `${req.session.userInfo.fname}'s Dashboard`,
                            rooms: rooms,
                            bookings: bookings
                        })
                    })
                    
                }
            })
            .catch(err => console.log(`Rooms weren't found: ${err}`))
        })
    }
})



router.get('/addRoom', isAuthenticated, isAdmin, (req, res) => {
    res.render('addRoom', {
        title: 'Add Room'
    })
})

router.post('/addRoom', isAuthenticated, isAdmin, (req, res) => {
    const formData = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        postalCode: req.body.postalCode,
        price: req.body.price,
        user: req.session.userInfo._id
    }

    const room = new Room(formData)
    room.save()
    .then(room => {
        if (req.files) {
            req.files.picture.name = `roomPhoto${path.parse(req.files.picture.name).ext}`

            const picturePath = `./public/uploads/rooms/${room.user}`
            // if /public/uploads/rooms/${room.user} doesn't exist, we're creating it
            if (!fs.existsSync(picturePath))
                fs.mkdirSync(picturePath);
            // creating folder for the room
            fs.mkdirSync(`${picturePath}/${room.title}`);

            // moving picture to its folder
            req.files.picture.mv(`${picturePath}/${room.title}/${req.files.picture.name}`)
            .then(() => {
                const fullPicPath = `/uploads/rooms/${room.user}/${room.title}/${req.files.picture.name}`
                room.updateOne({roomPic: fullPicPath})
                .then(() => {
                    console.log(`Picture ${req.files.picture.name} has been saved`)
                    res.redirect('/dashboard')
                })
                .catch(err => console.log(`Picture ${req.files.picture.name} has not been saved`))
            })
        } else {
            res.redirect('/dashboard')
        }

        console.log(`${formData.title} has been saved`)
        
    })
})



router.get('/booking/edit/:roomId', isAuthenticated, (req, res) => {
    User.findById(req.session.userInfo._id)
    .then(user => {
        for (booking of user.bookedRooms)
            if (booking.roomId == req.params.roomId)
                Room.findById(req.params.roomId)
                .then(room => {
                    res.render('roomBookingEdit', {
                        title: `Edit ${room.title}`,
                        room: room,
                        checkIn: JSON.stringify(booking.checkIn).substr(1,10),
                        checkOut: JSON.stringify(booking.checkOut).substr(1,10)
                    })
                })
                .catch(err => console.log(`Room wasn't found: ${err}`))
    })
    .catch(err => console.log(`User wasn't found: ${err}`))
})



router.delete('/booking/delete/:bookingId', isAuthenticated, (req, res) => {
    User.findById(req.session.userInfo._id)
    .then(user => {
        for (booking of user.bookedRooms)
            if (booking._id == req.params.bookingId)
                user.updateOne({$pull: {bookedRooms: {_id: booking._id}}})
                .then(() => res.redirect('/dashboard'))
                .catch(err => console.log(`Booking wasn't deleted: ${err}`)) 
    })
    .catch(err => console.log(`User wasn't found: ${err}`))
})



module.exports = router