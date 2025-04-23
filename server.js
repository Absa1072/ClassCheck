require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { signup, login } = require('./authHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'frontend' folder
app.use(express.static(__dirname));

app.post('/api/signup', signup);
app.post('/api/login', login);

//try
// Serve static files if needed
app.use(express.static(__dirname));

// Route fallback for login form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'studentLogin.html'));
});

app.post('/api/test', (req, res) => {
  res.json({ message: "✅ test route is working" });
});
//endtry

app.listen(3000, () => {
  console.log('Backend running at http://localhost:3000');
});