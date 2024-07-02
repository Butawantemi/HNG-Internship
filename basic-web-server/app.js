const express = require('express');
const axios = require('axios');
const { ip } = require('address');

const app = express();
const PORT = 3000;
const IPSTACK_API_KEY = 'YOUR_IPSTACK_API_KEY'; // Replace with your actual API key from IPStack
const OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key from OpenWeatherMap

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = ip(); // Using address package to get the IP address

    try {
        // Fetch location data using IPStack API
        const locationResponse = await axios.get(`http://api.ipstack.com/${clientIp}?access_key=${IPSTACK_API_KEY}`);
        const { city, latitude, longitude } = locationResponse.data;

        // Fetch weather data from OpenWeatherMap API using the latitude and longitude
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch location or weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
