const   express                                         = require('express'),
        router                                          = express.Router({mergeParams:true}),
        Campground                                      = require('../models/campground'),
        Review                                          = require('../models/review'),
        catchAsync                                      = require('../utils/catchAsync'),
        {validateReview, isLoggedIn,isReviewAuthor}     = require('../middleware')


router.post('/',isLoggedIn,validateReview,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success','Created new review!')
    res.redirect('/campgrounds/'+campground._id)
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req,res)=>{
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}},{useFindAndModify:false})
    await Review.findByIdAndDelete(reviewId,{useFindAndModify:false});
    req.flash('success','Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router