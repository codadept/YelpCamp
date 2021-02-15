const   mongoose        = require('mongoose'),
        Schema          = mongoose.Schema,
        reviewSchema    = new Schema({
            body:String,
            rating:Number
        });

module.exports = mongoose.model("Review",reviewSchema);