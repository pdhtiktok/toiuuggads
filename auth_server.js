require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${port}/oauth2callback`;

// Scopes required for Google Ads API
const SCOPES = 'https://www.googleapis.com/auth/adwords';

app.get('/auth', (req, res) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(SCOPES)}&` +
        `access_type=offline&` +
        `prompt=consent`;
    
    res.send(`<h1>Google Ads Auth</h1><a href="${authUrl}">Click here to Authorize App</a>`);
});

app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.send('No code found');
    }

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const { refresh_token, access_token } = response.data;
        
        res.send(`
            <h1>Authorization Successful!</h1>
            <p><b>Refresh Token:</b> <code>${refresh_token}</code></p>
            <p>Copy this Refresh Token and paste it into your .env file.</p>
            <pre>${JSON.stringify(response.data, null, 2)}</pre>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed');
    }
});

app.listen(port, () => {
    console.log(`Auth server running at http://localhost:${port}/auth`);
    console.log(`Make sure http://localhost:${port}/oauth2callback is added to your Redirect URIs in Google Cloud Console.`);
});
