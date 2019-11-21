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

module.exports = isAuthenticated