const express = require('express')
const router = express.Router()


router.get("/", (req, res)=>{
    res.render("index", {
        title : "Home | AirBnb"
    });
});


router.post("/", (req, res)=>{
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
        res.render("index", {
            checkinError : checkinError,
            checkoutError : checkoutError,
            datesError : datesError
        })
    } else {
        res.redirect("/");
    }

})


module.exports = router