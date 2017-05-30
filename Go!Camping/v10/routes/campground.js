var express = require ('express'),
    router = express.Router(),
    Campground = require("../models/campground");




//INDEX - show all campgrounds
router.get("/", function(req, res) {
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        (err) ? console.log(err): res.render("campgrounds/index", { campground: allCampgrounds});
    });
});


//CREATE - make new campground in DB
router.post("/", isLoggedIn, function(req, res) {
    console.log("you hit the post route!!");
    //get data from form add to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
         id : req.user._id,
         username : req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author :author};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        (err) ? console.log(err): res.redirect("/campground");
    });
});

//NEW - show form for adding new campground
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req, res) {
    //find campground with provided id
    Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground) {
        (err) ? console.log(err):
            res.render("campgrounds/show", { campground: foundCampground });
    });
});




// Edit Campground  routes
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            res.redirect('/campground')
        }else{
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    })
   res.render('campgrounds/edit', {campground: foundCampground});

});

// Update Campground routes


router.put('/id', (req, res) => {
    //find and update selected campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect('/campground');
        }else{
            res.redirect('/campground/' + req.params.id);
        }
    })
    // redirect to show page
});




//login middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}




module.exports = router;

