var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    app = express();

var Comment = require("./models/comment");





app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//default view engines
app.set("view engine", "ejs");



// Connect to database
var db = mongoose.connect("mongodb://127.0.0.1:27017/GO_Camping", function(err) {
    (err) ? console.error(err, 'Error Connecting to Database!'):
        console.log('Database Connected Successfully. Build Safely!')
});
seedDB();


// ==========
// PASSPORT CONFIG
// ==============================
app.use(require('express-session')({
    secret: "passport working magic",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
    res.locals.currentUser =req.user;
    next();
})








app.get("/", function(req, res) {
    res.render("home");
});

//INDEX - show all campgrounds
app.get("/campground", function(req, res) {
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        (err) ? console.log(err): res.render("campgrounds/index", { campground: allCampgrounds});
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
app.get("/campground/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW
app.get("/campground/:id", function(req, res) {
    //find campground with provided id
    Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground) {
        (err) ? console.log(err):
            res.render("campgrounds/show", { campground: foundCampground });
    });
});




// ==================================
// COMMENTS ROUTES
// ==================================
app.get("/campground/:id/comment/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        (err) ? console.log(err): res.render("comments/new.ejs", { campground: campground });
    })

})

app.post("/campground/:id/comment", isLoggedIn, (req, res) => {
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
                    campground.comment.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                    console.log("New comment added");
                }
            })
        }
    })
});

// ========
// Auth Routes
// ====================

app.get('/register', (req, res) => {
    res.render('register');

});

//handle signup logic
app.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campground');
        });
    });
});


//show login form
app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/campground',
    failureRedirect: '/login'
}), (req, res) => {

});


//Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campground');
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}





app.listen(3000, function() {
    console.log("GO!Camping app started");
});



// RESTFUL ROUTES
// ----------------
// INDEX      -GET  /campground
// NEW        -GET  /campground/new
// CREATE     -POST /campground
// SHOW       -GET  /campground/:id