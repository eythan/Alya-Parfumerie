const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, '0.0.0.0', () => {
  console.log('Server app listening on port ' + port);
});