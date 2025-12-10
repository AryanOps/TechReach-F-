const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { rating, comment, serviceId, orderId } = req.body;

    const review = new Review({
        name: req.user.name,
        rating,
        comment,
        user: req.user._id,
        serviceId,
        orderId
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
    const reviews = await Review.find({});
    res.json(reviews);
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        await Review.deleteOne({ _id: req.params.id });
        res.json({ message: 'Review removed' });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
};

module.exports = { createReview, getReviews, deleteReview };
