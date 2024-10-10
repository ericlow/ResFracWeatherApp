const express = require('express');
const cors = require('cors');
const axios = require('axios');
const winston = require ('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const GOOGLE_CLIENT_ID = '768224754997-jhh8h44n5v8qojvj1g11mnbe4k3f4lbt.apps.googleusercontent.com';

const app = express();
/** all cross origin resource sharing
 * The React frontend running on http://localhost:3000
 * The Node backend (API) running on http://localhost:5000 or another port
 */
app.use(cors());

app.use(express.json());
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// GET /get-user - Fetch user details from the database
app.get('/get-user', (req, res) => {
  logger.info(`get-user: ${req.query}`)

  const email = req.query.email;

  
  const query = 'SELECT * FROM users WHERE email = ?';

  db.get(query, [email], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log('4');

    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('5');

    // Return the user data as a JSON response
    res.json({
      first: row.first,
      last: row.last,
      email: row.email,
      apikey: row.apikey,
    });
    console.log('6');
  });
});

// GET /get-user - Fetch user details from the database
app.get('/get-weather', async (req, res) => {
  logger.info(req.query)
  const city = req.query.city;
  const email = req.query.email;
  logger.debug(`city: ${city}\t email: ${email}`);
  
  try {


    logger.debug(`await get user2`);
    const user = await getUser2(email);
    logger.debug(`user: \n ${JSON.stringify(user)}`);

    const weather = await getWeather(user.apikey, city);

//    getWeatherWithRetry(user.apikey, city)
    res.status(200).json(weather);
    logger.debug(`get-weather returns OK`)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/validate-user', async (req, res) => {
  logger.debug('validate-user: enter');
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    const userData = {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
    };
    logger.info(userData.firstName);
    logger.info(userData.lastName);
    logger.info(userData.email);
    upsertUser(userData.email, userData.firstName, userData.lastName);

    // Optionally store user information in your database here

    res.status(200).json(userData); // Return user data to frontend
    logger.debug('validate-user: exit 200');
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Invalid token');
  }
});

// Configure Log Rotation
const logger = winston.createLogger({
    level: 'debug',  // Minimum level to log (info and above)
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

    getWeatherWithRetry('6f515ee0ef34e313d26e2b6a18fe6b41', 'Oakland');
})

function helloWorld() {
  getWeatherWithRetry('6f515ee0ef34e313d26e2b6a18fe6b41', 'Oakland');
}


// Function to get weather from Weatherstack API
const getWeather = async (apikey, city) => {
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
    return {
      location: weatherData.location.name,
      temperature: weatherData.current.temperature,
      description: weatherData.current.weather_descriptions[0],
      humidity: weatherData.current.humidity,
      wind_speed: weatherData.current.wind_speed,
      weather_icons: weatherData.current.weather_icons
    };

  } catch (error) {
    console.error('Error fetching weather:', error.message);
    throw error; // Re-throw the error to handle it in the route handler
  }
};


// Function to fetch weather data with exponential backoff
async function getWeatherWithRetry(apikey, location) {
    try {
        // Make the API request
        
        const baseUrl = `http://api.weatherstack.com/current?access_key=${apikey}&query=${location}`;
        const response = await axios.get(baseUrl);

        // Check if the response has data
        if (response.data && response.data.current) {
            logger.debug(JSON.stringify(response.data));
            logger.info(`The weather in ${location} is: \n\n ${JSON.stringify(response.data.current)}`);
        } else {
            throw new Error('Invalid response from API');
        }

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
    }
}


// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to verify Google API token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the header

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token, GOOGLE_CLIENT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Apply the verifyToken middleware to the update-api-key route
app.post('/update-api-key', async (req, res) => {
  const { apiKey, email } = req.body;
  try {
    updateKey(email, apiKey);    
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ error: 'Failed to update API key' });
  }
});


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
db.get('SELECT 1', [], (err, row) => {
  if (err) {
    return logger.error('Error running query:', err.message);
  }
  logger.info(`Database connection healthy`);
});

function insertUser(email, firstName, lastName) {
    const sql = `
      INSERT INTO users (email, first, last)
      VALUES (?, ?, ?)
    `;
  
    db.run(sql, [email, firstName, lastName], function(err) {
      if (err) {
        logger.error('Error upserting user:', err.message);
      } else {
        logger.info(`User upserted or updated with email: ${email}`);
      }
    });
  }


function upsertUser(email, firstName, lastName) {
  const sql = `
  INSERT INTO users (email, first, last)
  VALUES (?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET
      first = excluded.first,
      last = excluded.last;`;

  db.run(sql, [email, firstName, lastName], function(err) {
    if (err) {
      logger.error('Error upserting user:', err.message);
    } else {
      logger.info(`User upserted or updated with email: ${email}`);
    }
  });
}

function getUser2(email) {
  return new Promise((resolve, reject) => {
    // Query the database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject('Error retrieving user: ' + err.message);
      } else {
        resolve(row);
      }
    });
  });
}



const getUser = (email) => {
  logger.debug(`getUser(${email}) called`);
  let user = null; // Variable to hold the user data

  // Synchronous function to execute the query
  const sql = `SELECT * FROM users WHERE email = ?`;
  logger.debug(`sql: ${sql}`);
  
  try {
    // Using db.prepare to create a statement
    const stmt = db.prepare(sql);
    
    // Using stmt.get to retrieve the row
    user = stmt.get(email); // This is a synchronous call
    logger.debug(`retrieved user: ${JSON.stringify(user)}`);

    // Finalize the statement to free resources
    stmt.finalize();
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
///  logger.debug(`retrieved user: ${JSON.stringify(user)}`);
  return user; // Return the user object or null if not found
};

function updateKey(email, apikey) {
  logger.debug(`updateKey(${email},${apikey})`);

  const sql = `UPDATE users SET apikey = ? WHERE email = ?`;

  db.run(sql, [apikey, email], function(err) {
    if (err) {
      logger.error('Error upserting user:', err.message);
    } else {
      logger.debug('changes: ' + this.changes);
      logger.info(`User upserted or updated with email: ${email}`);
    }
  });
}

// Close the database connection when the service shuts down
const shutdown = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Closed the database connection.');
    }
    process.exit(0); // Exit the process after closing the connection
  });
};

// Gracefully handle shutdown signals
process.on('SIGTERM', shutdown); // Sent by `kill`
process.on('SIGINT', shutdown);  // Sent by Ctrl+C in the terminal

logger.info('Server Started Successfully');
