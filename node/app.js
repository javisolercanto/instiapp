const express = require('express');
const http = require('http');
const app = express();
const port = parseInt(process.env.PORT, 10) || 5400;
const server = http.createServer(app);
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

// require('./routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/code.routes')(app);
require('./routes/category.routes')(app);
require('./routes/product.routes')(app);
require('./routes/location.routes')(app);

app.get('*', (req, res) => res.status(200).send({
  error: 'Welcome to the beginning of nothingness.',
}));

app.set('port', port);
server.listen(port);

module.exports = app;