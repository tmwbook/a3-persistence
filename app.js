const express = require('express');
const app = express();
const port = 3000;

/**
 * ----------------------------
 * ---- Define Routes
 * ----------------------------
 */

app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
app.listen(port, () => console.log(`We are listening on ${port}`));
