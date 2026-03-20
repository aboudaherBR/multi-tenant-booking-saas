const express = require('express');
const session = require('express-session');
const cors = require('cors');
const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.set('trust proxy', 1);

origin: isProduction
  ? ["https://barber-shop-indol-three.vercel.app"]
  : ["http://localhost:5173"]

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});




app.use(express.json());

app.use(
  session({
    name: 'saas_session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

/* ROTAS */

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const sessionRoutes = require('./routes/session.routes');
app.use('/api', sessionRoutes);

const availabilityRoutes = require('./routes/availability.routes');
app.use('/api', availabilityRoutes);

const appointmentsRoutes = require('./routes/appointments.routes');
app.use('/api', appointmentsRoutes);

const companyRoutes = require('./routes/company.routes');
app.use('/api', companyRoutes);

const scheduleBlocksRoutes = require('./routes/scheduleBlocks.routes');
app.use('/api', scheduleBlocksRoutes);

const clientsRoutes = require('./routes/clients.routes');
app.use('/api', clientsRoutes);

const professionalServicesRoutes = require('./routes/professionalServices.routes');
app.use('/api', professionalServicesRoutes);

const publicRoutes = require('./routes/public.routes');
app.use('/api', publicRoutes);

const professionalsRoutes = require('./routes/professionals.routes');
app.use('/api', professionalsRoutes);

const dashboardRoutes = require('./routes/dashboard.routes');
app.use('/api', dashboardRoutes);

const businessHoursRoutes = require('./routes/businessHours.routes');
app.use('/api', businessHoursRoutes);

const servicesRoutes = require('./routes/services.routes');
app.use('/api', servicesRoutes);

const reportsRoutes = require('./routes/reports.routes');
app.use('/api', reportsRoutes);



module.exports = app;