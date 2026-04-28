

const express = require('express');
const cors = require('cors');

console.log("🔥 VERSION CHECK - NOVO BUILD");

const app = express();

console.log("🔥 APP INICIOU");

// 🔴 LOG GLOBAL NO TOPO REAL
app.use((req, res, next) => {
  console.log("🔥 GLOBAL TOP:", req.method, req.url);
  next();
});

app.set('trust proxy', 1);






const allowedOrigins = [
  "https://barber-shop-indol-three.vercel.app",
  "http://localhost:5173", 
  "http://localhost:3000"  
];

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS bloqueado:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use(express.json());

app.use((req, _res, next) => {
  console.log("🔥 PASSOU AQUI:", req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log("🔥 DEBUG:", req.method, req.url);
  next();
});

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

const professionalMeRoutes = require('./routes/professional.me.routes');
app.use('/api', professionalMeRoutes);



module.exports = app;