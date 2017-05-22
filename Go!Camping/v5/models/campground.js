var mongoose = require("mongoose");

// campgound  schema
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