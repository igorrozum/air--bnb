const express = require('express')
const router = express.Router()
const isAuthenticated = require('../middleware/auth')
const Room = require('../Models/Room')
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
                rooms: rooms
            })
        })
    else
        res.render('userDashboard')
})


router.get('/addRoom', isAuthenticated, (req, res) => {
    res.render('addRoom')
})

router.post('/addRoom', isAuthenticated, (req, res) => {
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



module.exports = router