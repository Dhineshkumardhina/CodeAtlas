const express = require('express');
const router = express.Router();
const { analyzeRepo, getHistory, deleteHistoryItem } = require('../controllers/repositoryController');
const { protect, optionalAuth } = require('../middleware/auth');

// Repository routes
router.post('/analyze', optionalAuth, analyzeRepo);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteHistoryItem);

module.exports = router;
