var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");    


 var campgrounds =[
       {name: "Naija Creek",  image:"images/1.png"},
       {name: "Salmon Creek", image:"images/2.png"},
       {name: "Benin Creek",  image:"images/3.png"},
       {name: "Naija Creek",  image:"images/4.png"},
       {name: "Salmon Creek", image:"images/5.png"},
       {name: "Benin Creek",  image:"images/6.png"},
       {name: "Naija Creek",  image:"images/7.png"},
       {name: "Salmon Creek", image:"images/8.png"},
       {name: "Benin Creek",  image:"images/9.png"},
       {name: "Naija Creek",  image:"images/1.png"},
       {name: "Salmon Creek", image:"images/2.png"},
       {name: "Benin Creek",  image:"images/3.png"}
  ];


//home route
app.get("/", function(req, res){
    res.render("home");
});

//campgrounds route
app.get("/campground", function(req, res){
    res.render("campground", {campground :campgrounds });
});

//handle post request
app.post("/campground", function(req, res){
    console.log("you hit the post route!!");
    //get data from form add to campgrounds page
    var name = req.body.campName;
    var image= req.body.image;
    var newCampground ={name: name,  image:image};
    campgrounds.push(newCampground);
    //redirect to campground
    res.redirect("campground");
});


app.get("/campground/new", function(req, res){
    res.render("new");
});





app.listen(3000, function(){
    console.log("GO!Camping app started");
});