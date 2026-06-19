const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  repoUrl: {
    type: String,
    required: [true, 'Please add a repository URL'],
    trim: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: '',
  },
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  technologies: {
    type: [String],
    default: [],
  },
  folders: {
    type: [String],
    default: [],
  },
  importantFiles: {
    type: [String],
    default: [],
  },
  architecture: {
    type: mongoose.Schema.Types.Mixed, // Stores structural representation
    default: {},
  },
  aiSummary: {
    projectName: { type: String },
    overview: { type: String },
    architectureExplanation: { type: String },
    importantFiles: { type: [String], default: [] },
    beginnerStartingPoint: { type: String },
    learningRoadmap: { type: [String], default: [] }
  },
  roadmap: [
    {
      title: { type: String, required: true },
      url: { type: String },
      difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      skills: { type: [String], default: [] },
      files: { type: [String], default: [] },
      labels: { type: [String], default: [] }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Repository', RepositorySchema);
