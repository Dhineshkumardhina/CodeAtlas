const mongoose = require('mongoose');

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503);
    return next(new Error('Database is unavailable. Start MongoDB and try again.'));
  }

  return next();
};

module.exports = requireDatabase;
