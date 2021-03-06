var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds")
app = express();




// Connect to database
var db = mongoose.connect("mongodb://127.0.0.1:27017/GO_Camping", function(err) {
    (err) ? console.error(err, 'Error Connecting to Database!'):
        console.log('Database Connected Successfully. Build Safely!')
});
seedDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//default view engines
app.set("view engine", "ejs");




app.get("/", function(req, res) {
    res.render("home");
});

//INDEX - show all campgrounds
app.get("/campground", function(req, res) {
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        (err) ? console.log(err): res.render("index", { campground: allCampgrounds });
    });
});


//CREATE - make new campground
app.post("/campground", function(req, res) {
    console.log("you hit the post route!!");
    //get data from form add to campgrounds page
    var name = req.body.campName;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        (err) ? console.log(err): res.redirect("/campground");
    });
});

//NEW - show form for adding new campground
app.get("/campground/new", function(req, res) {
    res.render("new");
});

//SHOW
app.get("/campground/:id", function(req, res) {
    //find campground with provided id
    Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground) {
        (err) ? console.log(err):
            res.render("show", { campground: foundCampground });
    });
});





app.listen(3000, function() {
    console.log("GO!Camping app started");
});



// RESTFUL ROUTES
// ----------------
// INDEX      -GET  /campground
// NEW        -GET  /campground/new
// CREATE     -POST /campground
// SHOW       -GET  /campground/:id