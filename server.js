require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const admin = require('firebase-admin');

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://absa1072.github.io', 'https://classcheck.onrender.com'], 
  methods: ['GET', 'POST'],
  credentials: true
}));


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = admin.database();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// middleware
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

const saveLocation = async (req, res) => {
  try {
    const {netID, lat, lon} = req.body;

    if(!netID || !lat || !lon){
      return res.status(400).json({error: "Missing fields"});
    }
    const locRef = db.ref(`AttendanceRecords/${netID}`);

    await locRef.push({
      lat,
      lon,
      timestamp: Date.now()
    });

    res.status(200).json({message: "Location saved!"});
  } catch (error) {
    console.log("Error saving users location");
    res.status(500).json({error: "Error saving location"});
  }
};

// api POST into firebase database 
app.post('/create-profile', async (req, res)=> {
  const {netID, firstName, lastName, password, classes, role} = req.body;

  if(!netID || !firstName || !lastName || !password || !classes || classes.length===0){
    return res.status(400).json({error: 'Missing a required field. Please fill out all parts of the profile'});
  }

  try {
    const userRef = db.ref(`Users/${netID}`);
    await userRef.set({
      firstName,
      lastName,
      password,
      classes,
      role
    });
    
    res.status(200).json({message: 'Profile created successfully!'});
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({error: 'Failed to save profile'});
  }
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});

