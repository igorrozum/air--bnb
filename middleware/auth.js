exports.isAuthenticated = (req, res, next) => {
    if (req.session.userInfo) {
        return next()
    } else {
        res.render('index', {
            title: 'Home | AirBnb',
            signInShowValue: "show",
            signInblockValue: "block",
            bodyOpen: "modal-open",
            fadeValue: "modal-backdrop fade show",
            signInariaValue: "true"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.session.userInfo.admin == true) {
        return next()
    } else {
        res.render('permissions', {
            title: "Permissions Denied"
        })
    }
}

// module.exports = isAuthenticated