# ResFracWeatherApp
An application for checking weather

This demo shows the use of several technologies including: 
* ReactJS Browser Client
* Node.js Server
* integration with weatherstack.com
* Google OAuth2
* SQLite
* Unit Testing with Jest
* Service layer logging with Winston
* Bootstrap for CSS

# Repository
https://github.com/ericlow/ResFracWeatherApp

# System 
The following diagram shows how the app gets the client app gets the weather data from api.weatherstack.com

![Weather App System Diagram](docs/ResFrac%20Weather%20App.png)

# Local Development
## Pre-requisities
### Install SQLite

https://www.sqlite.org/download.html

### Initialize database
```
cd server/db
./create_db.sh
```

### Install client libraries
```
cd client
npm install
```
### Install server libraries
```
cd server
npm install
```

# Google account
  
This project uses Google OAuth for user authentication

# Weatherstack API
  
This app gets weather from the weatherstack api
Sign up for a free plan at https://weatherstack.com/product
make note of your API key

## Running the app
### Start the server
```
    cd server
    node index.js
```
### Start the client web server
```
    cd client
    npm start
```
### Open the Login screen
http://localhost:3000
