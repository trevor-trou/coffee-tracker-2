const express = require('express');
const path = require('path');

const port = 3005;

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile('./dist/index.html');
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});