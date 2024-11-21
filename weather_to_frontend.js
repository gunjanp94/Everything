const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

mongoose.connect('mongodb+srv://Gunjan:admin%40123@cluster1.d8lmd.mongodb.net/energyDB?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  })

  const userSchema = new mongoose.Schema({
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\..+/, 'Please fill a valid email address']
    },
    password: {
      type: String,  // Use String instead of true
      required: true,
      minlength: 6
    },
    photo: {
      type: String,
      unique: true
    },
    username: {
      type: String,
      unique: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    mobile_no: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please fill a valid mobile number']  // Fixed the regex for mobile number
    },
    address: {
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      district: {
        type: String,
        required: true
      }
    }
  });
  
const User = mongoose.model('User', userSchema);


// API to get weather based on userId
app.post('/get-weather', async (req, res) => {
  const { userId } = req.body;

  try {
    // Step 1: Find the user by ID and get the location
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cityName = user.address.city;

    // Step 2: Call the weather API using the location
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

    fetchWeather(cityName);
    // Step 4: Send the weather data as the response
    res.json(data);

  } catch (error) {
    console.error('Error fetching user or weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
