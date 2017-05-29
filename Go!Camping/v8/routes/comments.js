var express = require ('express'),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");



//comments new
router.get("/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        (err) ? console.log(err): res.render("comments/new.ejs", { campground: campground });
    })

})

//Comments create
router.post("/", isLoggedIn, (req, res) => {
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
                    console.log(comment);
                    campground.comment.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                    console.log("New comment added");
                }
            })
        }
    })
});

//login middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}





module.exports= router;