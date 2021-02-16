const   express                                         = require('express'),
        router                                          = express.Router({mergeParams:true}),
        catchAsync                                      = require('../utils/catchAsync'),
        {validateReview, isLoggedIn,isReviewAuthor}     = require('../middleware'),
        reviews                                         = require('../controllers/reviews')


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router