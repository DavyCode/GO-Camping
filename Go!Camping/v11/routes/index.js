var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');


//root route
router.get("/", function(req, res) {
    res.render("home");
});


// ========
// Auth Routes
// ====================

router.get('/register', (req, res) => {
    res.render('register');

});

//handle signup logic
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campground');
        });
    });
});


//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campground',
    failureRedirect: '/login'
}), (req, res) => {

});


//Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged You Out")
    res.redirect('/campground');
})

// //login middleware
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }




module.exports = router;