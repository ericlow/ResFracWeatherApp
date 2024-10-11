const axios = require('axios');
const { getWeather } = require('../weatherService.js')

// Mock axios.get
jest.mock('axios');

describe('getWeather', () => {
    let logger;

    beforeEach(() => {
      // Mock the logger
      logger = {
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
      };
    });

  it('should return weather data for a valid city and API key', async () => {

    // ARRAGE

    // Mock response from the Weatherstack API
    const mockResponse = {
      data: {
        location: { name: 'New York' },
        current: {
          temperature: 75,
          weather_descriptions: ['Sunny'],
          humidity: 60,
          wind_speed: 10,
          weather_icons: ['http://example.com/icon.png'],
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse); // Mock the axios.get call

    const apikey = 'test-api-key';
    const city = 'New York';


    // ACT
    const result = await getWeather(logger, apikey, city);

    // ASSERT
    expect(result).toEqual({
      location: 'New York',
      temperature: 75,
      description: 'Sunny',
      humidity: 60,
      wind_speed: 10,
      weather_icons: ['http://example.com/icon.png'],
    });
  });

  it('should throw an error when the API returns an error', async () => {

    // ARRANGE

    // Mock response with an API error
    const mockErrorResponse = {
      data: {
        error: { info: 'Invalid API key' },
      },
    };

    axios.get.mockResolvedValue(mockErrorResponse); // Mock the axios.get call

    const apikey = 'invalid-api-key';
    const city = 'Unknown City';

    // ACT
    const getWeatherPromise = getWeather(logger, apikey, city);

    // ASSERT
    await expect(getWeatherPromise).rejects.toThrow('Invalid API key');
  });
});