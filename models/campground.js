const   mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        Review      = require('./review')


const CampgroundSchema = new Schema({
    title: String,
    image:String,
    price: Number,
    description:String,
    location:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (data){
    if(data){
        await Review.deleteMany({
            _id:{
                $in: data.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);