const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  readiness_score: {
    type: Number,
    required: true
  },
  roast: {
    type: String
  },
  motivational_msg: {
    type: String
  },
  has_skills: {
    type: Boolean,
    default: true
  },
  missing_basic_skills: {
    type: Array,
    default: []
  },
  global_standing: {
    type: Object,
    default: {}
  },
  skill_importance_data: {
    type: Array,
    default: []
  },
  pro_recommendations: {
    type: Array,
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
