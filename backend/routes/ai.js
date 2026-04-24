/**
 * AI proxy routes.
 * Forwards requests from the frontend to the Python AI engine.
 */

const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const AI_ENGINE_URL = 'http://127.0.0.1:8000';

// Check if the Python AI engine is running
router.get('/ai-status', async (req, res) => {
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ status: 'AI Offline', message: 'Connection failed' });
  }
});

// Upload a resume PDF and forward to AI for analysis
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const jobRole = req.body.job_role || "General";
    console.log(`📄 Processing Resume for Role: ${jobRole}`);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('job_role', jobRole);

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/analyze-resume`, formData, {
      headers: { ...formData.getHeaders() },
    });

    fs.unlinkSync(req.file.path);
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

// Forward answer to AI for grading
router.post('/submit-answer', async (req, res) => {
  try {
    const { question, user_answer } = req.body;
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/grade-answer`, { question, user_answer });
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Grading Error:", error.message);
    res.status(500).json({ error: "Failed to grade answer" });
  }
});

// Get an interview question from AI
router.post('/get-question', async (req, res) => {
  try {
    const { job_role } = req.body;
    console.log("❓ Fetching question for role:", job_role);

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/get-question`, {
      job_role: job_role || "general"
    });

    res.json(aiResponse.data);
  } catch (error) {
    console.error("Question Fetch Error:", error.message);
    res.status(500).json({ question: "Tell me about yourself." });
  }
});

// Forward chat message to AI
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 Chat Message:", message);

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/chat`, { message });
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.json({ reply: "I'm having trouble connecting to my brain right now. Try again later." });
  }
});

module.exports = router;
