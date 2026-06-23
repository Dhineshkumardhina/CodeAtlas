const express = require('express');
const router = express.Router();
const { analyzeRepo, getHistory, deleteHistoryItem } = require('../controllers/repositoryController');
const { protect, optionalAuth } = require('../middleware/auth');
const requireDatabase = require('../middleware/requireDatabase');

// Repository routes
router.post('/analyze', optionalAuth, analyzeRepo);
router.get('/history', requireDatabase, protect, getHistory);
router.delete('/:id', requireDatabase, protect, deleteHistoryItem);

module.exports = router;
