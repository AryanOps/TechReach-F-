const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviews,
    deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview).get(getReviews);
router.route('/:id').delete(protect, admin, deleteReview);

module.exports = router;
