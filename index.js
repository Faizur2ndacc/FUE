// Import required modules
const express = require('express');
const cheerio = require('cheerio');
const path = require('path');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle the form submission and link extraction
app.post('/extract', (req, res) => {
    const { linkText } = req.body;

    // Check if input is empty
    if (!linkText.trim()) {
        return res.status(400).send('Error: No input provided.');
    }

    // Load HTML content into Cheerio
    const $ = cheerio.load(`<html><body>${linkText}</body></html>`);

    // Extract the link
    const extractedLink = $('a').attr('href');

    // Check if a link is found
    if (!extractedLink) {
        return res.status(400).send('Error: No link found in the input.');
    }

    // Redirect the user to the extracted link
    res.redirect(extractedLink);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
