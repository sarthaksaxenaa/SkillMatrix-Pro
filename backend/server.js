require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the User Model
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 2. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'Active', message: 'Backend Online' }));

// 3. AI Status Check
app.get('/api/ai-status', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ status: 'AI Offline', message: 'Connection failed' });
  }
});

// 4. REGISTER ROUTE
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// 5. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// 6. Resume Upload Route
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const jobRole = req.body.job_role || "General"; 
    console.log(`📄 Processing Resume for Role: ${jobRole}`);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('job_role', jobRole); 

    const aiResponse = await axios.post('http://127.0.0.1:8000/analyze-resume', formData, {
      headers: { ...formData.getHeaders() },
    });

    fs.unlinkSync(req.file.path);
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

// 7. Interview Answer (Written & Voice)
app.post('/api/submit-answer', async (req, res) => {
  try {
    const { question, user_answer } = req.body;
    const aiResponse = await axios.post('http://127.0.0.1:8000/grade-answer', { question, user_answer });
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Grading Error:", error.message);
    res.status(500).json({ error: "Failed to grade answer" });
  }
});

// 8. Get Interview Question
app.post('/api/get-question', async (req, res) => {
  try {
    const { job_role } = req.body;
    console.log("❓ Fetching question for role:", job_role);
    
    const aiResponse = await axios.post('http://127.0.0.1:8000/get-question', {
      job_role: job_role || "general"
    });

    res.json(aiResponse.data);
  } catch (error) {
    console.error("Question Fetch Error:", error.message);
    res.status(500).json({ question: "Tell me about yourself." });
  }
});

// 9. NEW: Chatbot Route (Connects Frontend Chat to Python AI)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 Chat Message:", message);
    
    // Forward to Python AI
    const aiResponse = await axios.post('http://127.0.0.1:8000/chat', { message });
    
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.json({ reply: "I'm having trouble connecting to my brain right now. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
  console.log(`=================================`);
});