var Campground = require('../models/campground'),
    Comment = require('../models/comment');

// All middleware
var middlewareObj = {};

// Check Comment ownership middleware
middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                //does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                    //otherwise, redirect
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect('back');
                }
            }
        });
        //if not, redirect
    } else {
        req.flash("error", 'You must be logged in to edit this campground');
        res.redirect('back')
    }
}



// Check campground ownership middleware

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "No Campground Found");
                res.redirect('back');
            } else {
                //does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                    //otherwise, redirect
                } else {
                    req.flash("error", "You Do Not Have The Permission");
                    res.redirect('back');
                }
            }
        });
        //if not, redirect
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect('back')
    }
}




//login middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login First!');
    res.redirect('/login');
}



module.exports = middlewareObj;