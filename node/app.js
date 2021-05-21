const express = require('express');
const http = require('http');
const app = express();
const port = 5400;
const server = http.createServer(app);
const cors = require('cors');

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/code.routes')(app);
require('./routes/category.routes')(app);
require('./routes/product.routes')(app);
require('./routes/location.routes')(app);
require('./routes/route.routes')(app);
require('./routes/rental.routes')(app);
require('./routes/post.routes')(app);
require('./routes/group.routes')(app);
require('./routes/sentry.routes')(app);

Sentry.init({
  dsn: "https://202a98ce9e844846aa5801313e235950@o689512.ingest.sentry.io/5774250",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.get('*', (req, res) => res.status(200).send({
  error: 'Welcome to the beginning of nothingness.',
}));

app.set('port', port);
server.listen(port);

module.exports = app;