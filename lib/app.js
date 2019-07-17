const express = require('express');
const app = express();
const logger = require('../lib/middleware/logger');


app.use(logger);
app.use(express.json());

app.use('/api/v1/studios', require('./routes/studios'));
app.use('/api/v1/actors', require('./routes/actors'));
// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
