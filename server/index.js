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

    axios.get('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => {
        console.log('Data fetched successfully:', response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
})
