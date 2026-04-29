const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://barber-shop-indol-three.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://barber-shop-git-feature-signup-salon-aboudahers-projects.vercel.app",
];

// LOG GLOBAL
app.use((req, _res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS CONFIG
const corsOptions = {
  origin(origin, callback) {
    console.log(`[CORS] Origin: ${origin || "no-origin"}`);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// 🔥 CORS PRIMEIRO
app.use(cors(corsOptions));

// 🔥 INTERCEPTA PREFLIGHT (ANTES DE TUDO)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// BODY PARSER
app.use(express.json());

// HEALTH CHECK
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ROTAS */
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/session.routes"));
app.use("/api", require("./routes/availability.routes"));
app.use("/api", require("./routes/appointments.routes"));
app.use("/api", require("./routes/company.routes"));
app.use("/api", require("./routes/scheduleBlocks.routes"));
app.use("/api", require("./routes/clients.routes"));
app.use("/api", require("./routes/professionalServices.routes"));
app.use("/api", require("./routes/public.routes"));
app.use("/api", require("./routes/professionals.routes"));
app.use("/api", require("./routes/dashboard.routes"));
app.use("/api", require("./routes/businessHours.routes"));
app.use("/api", require("./routes/services.routes"));
app.use("/api", require("./routes/reports.routes"));
app.use("/api", require("./routes/professional.me.routes"));

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR HANDLER
app.use((err, _req, res, _next) => {
  if (err && err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  console.error("[ERROR]", err);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;