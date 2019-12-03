const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('homepage');
});

app.get('/api/leagues', (req, res) => {
    res.send('leagues');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));