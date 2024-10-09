const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const winston = require ('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


/** all cross origin resource sharing
 * The React frontend running on http://localhost:3000
 * The Node backend (API) running on http://localhost:5000 or another port
 */
app.use(cors());


// Configure Log Rotation
const logger = winston.createLogger({
    level: 'info',  // Minimum level to log (info and above)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Log to the console
        new winston.transports.Console(),
        
        // Log to a file (logs/app.log)
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '3d'  // Keep logs for 3 days
        })
    ]
});


app.listen(8080, () => {
    logger.info('server listening on port 8080')
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
        logger.info(response);
        // Check if the response has data
        if (response.data && response.data.current) {
            logger.info(`The weather in ${location} is:`, response.data.current);
        } else {
            throw new Error('Invalid response from API');
        }

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);

        // Retry logic with exponential backoff
        if (retries > 0) {
            logger.info(`Retrying... attempts left: ${retries}`);
            const newDelay = delay * 2; // Exponential backoff
            await new Promise(res => setTimeout(res, newDelay));
            return getWeatherWithRetry(retries - 1, newDelay);
        } else {
            console.error('Failed after maximum retries');
        }
    }
}


// Define the path to your SQLite database file
const dbPath = path.resolve(__dirname, 'db', 'users.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return logger.error('Error connecting to the database:', err.message);
  }
  logger.info('Connected to the SQLite database.');
});

// Run a simple SQL query to test the connection
db.get('SELECT COUNT(*) from users', [], (err, row) => {
  if (err) {
    return logger.error('Error running query:', err.message);
  }
  logger.info(`Query result: ${row.result}`); // Should output: Query result: 2
});

function upsertUser(email, firstName, lastName) {
    const sql = `
      INSERT INTO users (email, first, last)
      VALUES (?, ?, ?)
    `;
  
    db.run(sql, [email, firstName, lastName], function(err) {
      if (err) {
        console.error('Error upserting user:', err.message);
      } else {
        console.log(`User upserted or updated with email: ${email}`);
      }
    });
  }

  upsertUser('eric2@google.com', 'eric2', 'low2');


// Close the database connection after the query is done
db.close((err) => {
  if (err) {
    return logger.error('Error closing the database connection:', err.message);
  }
  logger.info('Database connection closed.');
});


logger.info('Server Started Successfully');
