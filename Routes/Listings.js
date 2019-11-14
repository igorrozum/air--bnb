const express = require('express')
const router = express.Router()



router.get("/", (req, res)=>{
    res.render("listings", {
        title : "Room Listings - Airbnb"
    });
});


module.exports = router