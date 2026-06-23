const Repository = require('../models/Repository');
const analyzerService = require('../services/analyzerService');
const mongoose = require('mongoose');

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Analyze repository structure and issues
 * @route   POST /api/repository/analyze
 * @access  Public (Optional Auth)
 */
const analyzeRepo = async (req, res, next) => {
  const { repoUrl } = req.body;

  try {
    if (!repoUrl) {
      res.status(400);
      return next(new Error('Please provide a repository URL'));
    }

    let cachedRepo = null;

    if (isDatabaseConnected()) {
      // 1. Check database for existing analysis cached
      // Standardize URL to search matching cases (removing trailing slash, lowercase, .git extension)
      const normalizedUrl = repoUrl.trim().replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();

      // We search using regex to find case-insensitive matching URL or similar clean path
      cachedRepo = await Repository.findOne({
        repoUrl: new RegExp('^' + normalizedUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
      });
    }

    if (cachedRepo) {
      console.log(`Serving cached analysis for ${repoUrl}`);
      
      // If user is logged in, link this repo analysis to their user id if not already linked
      if (req.user && !cachedRepo.userId) {
        cachedRepo.userId = req.user.id;
        await cachedRepo.save();
      }

      return res.status(200).json({
        success: true,
        repositoryData: {
          projectName: cachedRepo.projectName,
          description: cachedRepo.description,
          language: cachedRepo.language,
          stars: cachedRepo.stars,
          forks: cachedRepo.forks,
          technologies: cachedRepo.technologies,
          folders: cachedRepo.folders,
          importantFiles: cachedRepo.importantFiles,
        },
        aiExplanation: cachedRepo.aiSummary,
        roadmap: cachedRepo.roadmap
      });
    }

    // 2. Perform analysis via analyzerService
    console.log(`Performing live analysis for ${repoUrl}`);
    const analysis = await analyzerService.analyzeRepository(repoUrl);

    if (isDatabaseConnected()) {
      // 3. Save to database cache
      const newRepo = new Repository({
        userId: req.user ? req.user.id : null,
        repoUrl: repoUrl,
        projectName: analysis.repositoryData.projectName,
        description: analysis.repositoryData.description,
        language: analysis.repositoryData.language,
        stars: analysis.repositoryData.stars,
        forks: analysis.repositoryData.forks,
        technologies: analysis.repositoryData.technologies,
        folders: analysis.repositoryData.folders,
        importantFiles: analysis.repositoryData.importantFiles,
        aiSummary: analysis.aiExplanation,
        roadmap: analysis.roadmap
      });

      await newRepo.save();
    }

    res.status(200).json({
      success: true,
      repositoryData: analysis.repositoryData,
      aiExplanation: analysis.aiExplanation,
      roadmap: analysis.roadmap
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's analyzed repositories history
 * @route   GET /api/repository/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await Repository.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('projectName repoUrl language stars forks createdAt');
      
    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a cached repo from history
 * @route   DELETE /api/repository/:id
 * @access  Private
 */
const deleteHistoryItem = async (req, res, next) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      res.status(404);
      return next(new Error('Repository analysis not found'));
    }

    // Check ownership
    if (!repo.userId || repo.userId.toString() !== req.user.id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to delete this analysis'));
    }

    await repo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Analysis deleted from history'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeRepo,
  getHistory,
  deleteHistoryItem
};
