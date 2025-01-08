const fs = require('fs');
const path = require('path');

// Load JSON data from the `books.json` file
module.exports = () => {
    const filePath = path.join(__dirname, '../assets/books.json');
    const books = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return books;  // Return books
};