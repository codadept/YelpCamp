const   mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        Review      = require('./review')


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        } 
    },
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
},{toJSON:{virtuals:true}})

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
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