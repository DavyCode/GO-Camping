var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [{
        name: "Jabi Lake",
        image: "images/1.png",
        description: "mountains beyound reach"
    },
    {
        name: "paloma creek",
        image: "images/1.png",
        description: "mountains beyound the wild"
    },
    {
        name: "Hills valley",
        image: "images/1.png",
        description: "valleys with the tallest mountains"
    }
];


function seedDB() {
    //remove all campgrounds
    Campground.remove({}, function(err) {
        (err) ? console.log(err): console.log("Yeah removal worked!");

        //add few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                // (err)? console.log(err): console.log("New camp added");
                if (err) {
                    console.log(err)
                } else {
                    console.log("New camp added");

                    //create comment
                    Comment.create({
                        text: "Why not decide to camp with us today",
                        author: "Craige paul"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err)
                        } else {
                            campground.comment.push(comment);
                            campground.save();
                            console.log("New comment created");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;