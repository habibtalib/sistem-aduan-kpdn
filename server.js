// server.js
// Titik masuk utama aplikasi (Hari 2).
// Tambahan berbanding Hari 1: pembaca data borang + laluan CRUD dalam routes/web.js.

require("dotenv").config();

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const webRoutes = require("./routes/web");

const app = express();
const PORT = process.env.PORT || 3000;

// Sambung ke pangkalan data MongoDB.
connectDB();

// Enjin paparan EJS + layout.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware.
app.use(express.urlencoded({ extended: true })); // baca data borang (req.body)
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Daftarkan laluan.
app.use("/", webRoutes);

// Halaman 404.
app.use((req, res) => {
  res.status(404).render("404", { title: "Halaman Tidak Dijumpai" });
});

app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
