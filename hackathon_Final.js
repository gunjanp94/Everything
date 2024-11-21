const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs'); 
const path = require('path'); 
const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database');

// Replace with the path to your Firebase service account key JSON file
const serviceAccount = require("./firebase-service-account-P3.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project3-2b5f4-default-rtdb.firebaseio.com/" // Replace with your database URL
});


const serviceAccount = require('./firebase-service-account-P2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project1-41952-default-rtdb.firebaseio.com/'
});

const app = express()
const port = 3000;

app.use(express.json());

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "https://your-database.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Function to fetch user data from Firebase
async function fetchUserData(userId) {
  try {
    const db = admin.database();
    console.log(`Fetching data from path: /${userId}`);
    const ref = db.ref(`/${userId}`);
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    try {
        const filePath = path.join(__dirname, 'data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data saved successfully to data.json');
      } catch (fileError) {
        console.error('Error writing to data.json:', fileError);
      }
      
    async function uploadData() {
        const db = admin.database();
        try {
            // Read the data from the JSON file
            const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

            // Upload the data to Firebase
            await db.ref("/1234").set(data);
            console.log("Data uploaded successfully!");
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    uploadData();
    return snapshot.val();

  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// GET endpoint to fetch user data
app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await fetchUserData(userId);
    console.log('I have got the data');

    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example usage
const testUserId = '1235';
fetchUserData(testUserId)
  .then(userData => console.log('Fetched user data:', userData))
  .catch(error => console.error('Error:', error));
  
  // API to get weather based on userId
app.post('/get-weather', async (req, res) => {
    const { userId } = req.body;
  
    try {
      // Step 1: Get the user's city from Firebase Realtime Database
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
  
      if (!userSnapshot.exists()) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userData = userSnapshot.val();
      const city = userData.city;
      fetchWeather(city);
      if (!city) {
        return res.status(400).json({ error: 'City not found for the user' });
      }
  
      // Step 2: Call the weather API using the city
      const BASE_URL = "http://api.weatherapi.com/v1";
      const API_KEY = "9d61cb43b7cc4446b1a132350241511";
  
  // Function to fetch weather data
  async function fetchWeather(city) {
      try {
          const response = await axios.get(`${BASE_URL}/current.json`, {
              params: {
                  key: API_KEY,
                  q: city,
                  aqi: "no"
              }
          });
          const data = response.data;
          console.log(`Current weather in ${data.location.name}, ${data.location.country}:`);
          console.log(`Temperature: ${data.current.temp_c}°C`);
          console.log(`Condition: ${data.current.condition.text}`);
          console.log(`Wind Speed: ${data.current.wind_kph} kph`);
          console.log(`Humidity: ${data.current.humidity}%`);
      } catch (error) {
          console.error(`An error occurred: ${error.message}`);
      }
  }
      // Step 4: Send the weather data as the response
      res.json(data);
  
    } catch (error) {
      console.error('Error fetching user or weather data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });