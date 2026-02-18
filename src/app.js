const express = require('express');
const session = require('express-session');
const app = express();

app.use(
  session({
    name: 'saas_session',
    secret: 'sua_chave_super_secreta_temporaria',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use(authRoutes);


app.get('/', (req, res) => {
  res.send('API online');
});

const appointmentsRoutes = require('./routes/appointments.routes');
app.use(appointmentsRoutes);

const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;
