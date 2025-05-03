const express = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://causal-cacao-457203-s1-default-rtdb.firebaseio.com"
});

const db = admin.database();

const app = express();

app.use(express.json());

//app.use(express.static(path.join(__dirname, 'public')));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'mPurOLtaLvYeN1LyD9pT07HQs7cIufFV0iejj48xUnMzjw26jy4ErCsromQY8oVQ',
  baseURL: 'http://localhost:3000',
  clientID: 'VJwDlz26K2Duzl8GpWxOTHPpAnxs5nPE',
  issuerBaseURL: 'https://dev-csb64xqu8rysh5zp.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
//middleware
app.use(auth(config));

const { requiresAuth } = require('express-openid-connect');

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

app.get('user');

app.use(express.json());

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

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});

