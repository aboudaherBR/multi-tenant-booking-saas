const express = require('express');
const session = require('express-session');
const cors = require('cors');

console.log("🔥 VERSION CHECK - NOVO BUILD");

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.set('trust proxy', 1);

// ✅ CORS CONFIG CORRIGIDO
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌍 Origin recebida:", origin);

    const allowedOrigins = [
      "https://barber-shop-indol-three.vercel.app",
      "https://barber-shop-fxgdm3blk-aboudahers-projects.vercel.app", // 🔥 adiciona isso
      "http://localhost:5173"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Origin bloqueada:", origin);
      callback(null, false); // 🔥 CORREÇÃO CRÍTICA
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// ✅ GARANTE RESPOSTA PARA PREFLIGHT
app.options(/.*/, cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://barber-shop-indol-three.vercel.app",
      "https://barber-shop-fxgdm3blk-aboudahers-projects.vercel.app",
      "http://localhost:5173"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));



app.use(express.json());

app.use((req, _res, next) => {
  console.log("🔥 PASSOU AQUI:", req.method, req.url);
  next();
});

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