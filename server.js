require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://absa1072.github.io', 'http://localhost:3000'], 
  methods: ['GET', 'POST'],
  credentials: true
}));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const db = admin.database();

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(config));

// Routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Create Profile for Student API
app.post('/create-profile', async (req, res) => {
  const { netID, firstName, lastName, password, classes, role } = req.body;

  if (!netID || !firstName || !lastName || !password || !classes || classes.length === 0) {
    return res.status(400).json({ error: 'Missing a required field. Please fill out all parts of the profile.' });
  }

  try {
    const userRef = db.ref(`Users/${netID}`);
    await userRef.set({
      firstName,
      lastName,
      password,
      classes,
      role,
    });

    res.status(200).json({ message: 'Profile created successfully!' });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Create Profile for Professor API
app.post('/create-teacher-profile', async (req, res) => {
  const { netID, firstName, lastName, password, classes, role } = req.body;

  if (!netID || !firstName || !lastName || !password || !classes || classes.length === 0) {
    return res.status(400).json({ error: 'Missing a required field. Please fill out all parts of the profile.' });
  }

  try {
    const profRef = db.ref(`Professors/${netID}`);
    await profRef.set({
      firstName,
      lastName,
      password,
      classes,
      role,
    });

    res.status(200).json({ message: 'Profile created successfully!' });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

//Get user from database API
app.get('/get-user', async (req, res) => {
  const netID = req.query.netID;

  if(!netID){
    return res.status(400).json({error:' Missing netID, cannot get user'});
  }

  try {
    const userRef = db.ref(`Users/${netID}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val(); 

    if(!userData){
      return res.status(400).json({error: 'Missing user data/user not found'});
    } 

    return res.status(200).json(userData);
    } catch (error) {
      console.error('Error saving profile', err);
      res.status(500).json({error: 'Failed to get profile'});
  }
});

// get users classes from firebase
app.get('/get-classes', async (req, res) => {
  try {
    const classesRef = db.ref('Classes');
    const snapshot = await classesRef.once('value');
    const data = snapshot.val();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// save users location to firebase
app.post('/save-location', async(req, res) => {
  const {netID, courseName, status, date, time, lat, lon} = req.body;

  if (!netID || !courseName || !status || !lat || !lon) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if(!status){
    return res.status(400).json({error: "Missing students attendance status."});
  }

  try {
    const userRef = db.ref(`AttendanceRecords/${netID}`);
    await userRef.push({
      netID,
      courseName,
      status,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      lat,
      lon
    });

    res.status(200).json({message: 'Attendance saved!'});
  } catch (err) {
    console.error('Error saving attendance', err);
    res.status(500).json({error: 'Failed to save attendance'});
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
