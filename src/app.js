require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

// Auto-sync database on startup (production)
if (
  process.env.NODE_ENV === "production" &&
  process.env.AUTO_MIGRATE === "true"
) {
  sequelize
    .sync({ alter: true })
    .then(() => console.log("Database synced"))
    .catch((err) => console.error("Database sync error:", err));
}

// Or run migrations manually
if (process.env.RUN_MIGRATIONS === "true") {
  const { exec } = require("child_process");
  exec("npx sequelize-cli db:migrate", (err, stdout, stderr) => {
    if (err) {
      console.error("Migration error:", err);
      return;
    }
    console.log("Migrations completed:", stdout);
  });
}

const authRoutes = require("./routes/auth");
const publicRoutes = require("./routes/public");
const kasirRoutes = require("./routes/kasir");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "development" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/kasir", kasirRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
  } catch (e) {
    console.error("DB connect error:", e.message);
  }
  console.log(`Server running on ${PORT}`);
});
