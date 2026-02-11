const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API online');
});

const appointmentsRoutes = require('./routes/appointments.routes');
app.use(appointmentsRoutes);

const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;
