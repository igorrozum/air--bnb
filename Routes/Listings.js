const express = require('express')
const router = express.Router()
const Room = require('../Models/Room')
const User = require('../Models/User')


router.get("/", (req, res)=>{
    Room.find()
    .then(rooms => {
        res.render("listings", {
            title : "Room Listings",
            rooms: rooms
        });
    })
    .catch(err => console.log(`Room weren't fetched`))
});


router.post('/', (req, res) => {
    let valid = true
    let checkinError = "";
    let checkoutError = "";
    let datesError = "";
    const curDate = new Date().setHours(0, 0, 0, 0);
    const checkinDate = new Date(req.body.checkinDate);
    const checkoutDate = new Date(req.body.checkoutDate);

    if (req.body.checkinDate == "" || checkinDate.toString() == "Invalid Date") {
        checkinError = "Enter correct Check-in date"
        valid = false
    } else if (checkinDate < curDate) {
        checkinError = "Date can't be lower than today"
        valid = false
    }
        
    if (req.body.checkoutDate == "" || checkoutDate.toString() == "Invalid Date") {
        checkoutError = "Enter correct Check-out date"
        valid = false
    } else if (checkoutDate < curDate) {
        checkoutError = "Date can't be lower than today"
        valid = false
    }

    if (valid && checkinDate > checkoutDate)
        datesError = "Check-out date can't be before check-in date"

    if (valid && checkinDate.toString() == checkoutDate.toString())
        datesError = "Room can be booked minimum for one day"

    if (checkinError || checkoutError || datesError) {
        Room.find()
        .then(rooms => {
            res.render("listings", {
                title: 'Room Listings',
                rooms: rooms,
                checkinError : checkinError,
                checkoutError : checkoutError,
                datesError : datesError
            })
        })
        .catch(err => console.log(`Rooms search failed: ${err}`))
    } else {
        User.find()
        .then(users => {
            if (users) {
                const roomIds = []
                for (user of users) {
                    for (let i = 0; i < user.bookedRooms.length; i++) {
                        if ((checkinDate >= user.bookedRooms[i].checkIn && checkinDate < user.bookedRooms[i].checkOut) || (checkoutDate > user.bookedRooms[i].checkIn && checkoutDate <= user.bookedRooms[i].checkOut))
                            roomIds.push(user.bookedRooms[i].roomId)
                        else if (checkinDate <= user.bookedRooms[i].checkIn && checkoutDate >= user.bookedRooms[i].checkOut)
                            roomIds.push(user.bookedRooms[i].roomId)
                    }
                }
                Room.find({'_id': {$nin: roomIds}})
                .then(rooms => {
                    res.render('listings', {
                        title: 'Room Listings',
                        rooms: rooms
                    })
                })
                .catch(err => console.log(`Rooms weren't found for this date: ${err}`))
            }
        })
        .catch(err => console.log(`Users weren't found: ${err}`))
    }
})


module.exports = router