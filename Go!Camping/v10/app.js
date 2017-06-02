var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    passport = require('passport'),
    methodOverride = require('method-override'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    app = express();

var Comment = require("./models/comment");


//require route 
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campground'),
    indexRoutes      = require('./routes/index');


// Connect to database
var db = mongoose.connect("mongodb://127.0.0.1:27017/GO_Camping", function(err) {
    (err) ? console.error(err, 'Error Connecting to Database!'):console.log('Database Connected Successfully. Build Safely!')
});
    


app.use(bodyParser.urlencoded({ extended: true }));
//default view engines
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

// seedDB();  // seed database 


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
});

//use routes
app.use('/',indexRoutes);
app.use('/campground/:id/comment',commentRoutes);
app.use('/campground',campgroundRoutes);




app.listen(3000, function() {
    console.log("GO!Camping app started");
});



// RESTFUL ROUTES
// ----------------
// INDEX      -GET  /campground
// NEW        -GET  /campground/new
// CREATE     -POST /campground
// SHOW       -GET  /campground/:id