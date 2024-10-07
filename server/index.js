const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());

console.log(app)

app.listen(8080, () => {
      console.log('server listening on port 8080')
})

app.get('/', (req, res) => {
    res.send('Hello from our server!')

    // Call the function to get weather data
    getWeatherWithRetry('Oakland');
})

// Function to fetch weather data with exponential backoff
async function getWeatherWithRetry(location, retries = 3, delay = 1000) {
    try {
        // Make the API request
        
        const baseUrl = 'http://api.weatherstack.com/current?access_key=6f515ee0ef34e313d26e2b6a18fe6b41&query=${location}';
        const response = await axios.get(baseUrl);
        console.log(response);
        // Check if the response has data
        if (response.data && response.data.current) {
            console.log(`The weather in ${location} is:`, response.data.current);
        } else {
            throw new Error('Invalid response from API');
        }

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);

        // Retry logic with exponential backoff
        if (retries > 0) {
            console.log(`Retrying... attempts left: ${retries}`);
            const newDelay = delay * 2; // Exponential backoff
            await new Promise(res => setTimeout(res, newDelay));
            return getWeatherWithRetry(retries - 1, newDelay);
        } else {
            console.error('Failed after maximum retries');
        }
    }
}

