const axios = require('axios');

// Function to get weather from Weatherstack API
const getWeather = async (logger, apikey, city) => {
    logger.debug(`getWeather(${apikey}, ${city})`)
    try {
      const weatherResponse = await axios.get(`http://api.weatherstack.com/current`, {
        params: {
          access_key: apikey,
          query: city,
          units: 'f'
        }
      });
      
      const weatherData = weatherResponse.data;
  
      // Check for API error
      if (weatherData.error) {
        throw new Error(weatherData.error.info);
      }
  
      // Return the relevant weather data
      logger.debug(`getWeather() completed successfully`);
      return {
        location: weatherData.location.name,
        temperature: weatherData.current.temperature,
        description: weatherData.current.weather_descriptions[0],
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_speed,
        weather_icons: weatherData.current.weather_icons
      };
  
    } catch (error) {
      logger.error('Error fetching weather:', error.message);
      throw error; // Re-throw the error to handle it in the route handler
    }
};
  
module.exports = { getWeather };