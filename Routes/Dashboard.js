const express = require('express')
const router = express.Router()


function isAuthenticated(req, res, next) {
    if (req.session.userInfo) {
        return next();
    } else {
        res.render('index', {
            signInShowValue: "show",
            signInblockValue: "block",
            bodyOpen: "modal-open",
            fadeValue: "modal-backdrop fade show",
            signInariaValue: "true"
        })
    }
  }



router.get('/', isAuthenticated, (req, res) => {
    if (req.session.userInfo.admin)
        res.render('adminDashboard')
    else
        res.render('userDashboard')
})



module.exports = router