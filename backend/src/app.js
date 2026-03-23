const express = require('express');
const cors = require('cors');

console.log("🔥 VERSION CHECK - NOVO BUILD");

const app = express();

app.set('trust proxy', 1);

// ✅ CORS PROFISSIONAL
const allowedOrigins = [
  "https://barber-shop-indol-three.vercel.app",
  "https://barber-shop-fxgdm3blk-aboudahers-projects.vercel.app",
  "https://barber-shop-git-jwt-migration-aboudahers-projects.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("🌍 Origin recebida:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Origin bloqueada:", origin);
      callback(new Error("Not allowed by CORS")); // 🔥 melhor prática
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// ✅ PREFLIGHT
app.options('*', cors());

app.use(express.json());

app.use((req, _res, next) => {
  console.log("🔥 PASSOU AQUI:", req.method, req.url);
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

module.exports = app;