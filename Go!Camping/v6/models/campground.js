var mongoose = require("mongoose");

// Campground  schema
var GocampingSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", GocampingSchema);