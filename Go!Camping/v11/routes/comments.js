var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require('../middleware');



//comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        (err) ? console.log(err): res.render("comments/new.ejs", { campground: campground });
    })

})

//Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comment.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                    console.log("New comment added");
                }
            })
        }
    });
});



// Comment Edit Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
        }
    });

});

// Comment Update  
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campground/' + req.params.id);
        }
    });
});


// Comment Destroy Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    //  findByIdAndRemove  
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campground/' + req.params.id);
            console.log('ooh comment deleted!!!!');
        };
    });
});



module.exports = router;