const   express                                         = require('express'),
        router                                          = express.Router(),
        catchAsync                                      = require('../utils/catchAsync'),
        {isLoggedIn,validateCampground,isAuthor}        = require('../middleware'),
        campgrounds                                     = require('../controllers/campgrounds')



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn ,validateCampground ,catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn ,campgrounds.renderNewForm)

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn ,validateCampground, isAuthor ,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))

module.exports = router