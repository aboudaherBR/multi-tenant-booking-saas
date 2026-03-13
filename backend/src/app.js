const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    name: 'saas_session',
    secret: 'sua_chave_super_secreta_temporaria',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

/* ROTAS */

const authRoutes = require('./routes/auth.routes');
app.use(authRoutes);

const sessionRoutes = require('./routes/session.routes');
app.use(sessionRoutes);

const availabilityRoutes = require('./routes/availability.routes');
app.use(availabilityRoutes);

const appointmentsRoutes = require('./routes/appointments.routes');
app.use(appointmentsRoutes);

const companyRoutes = require('./routes/company.routes');
app.use(companyRoutes);

const scheduleBlocksRoutes = require('./routes/scheduleBlocks.routes');
app.use(scheduleBlocksRoutes);

const clientsRoutes = require('./routes/clients.routes');
app.use(clientsRoutes);

const professionalServicesRoutes = require('./routes/professionalServices.routes');
app.use(professionalServicesRoutes);

const publicRoutes = require('./routes/public.routes');
app.use(publicRoutes);

const professionalsRoutes = require('./routes/professionals.routes');
app.use(professionalsRoutes);

const dashboardRoutes = require('./routes/dashboard.routes');
app.use(dashboardRoutes);

const businessHoursRoutes = require('./routes/businessHours.routes');
app.use(businessHoursRoutes);

const servicesRoutes = require('./routes/services.routes');
app.use(servicesRoutes);

const reportsRoutes = require('./routes/reports.routes');
app.use(reportsRoutes);

module.exports = app;