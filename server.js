// server.js
// Titik masuk utama aplikasi Sistem Aduan Pengguna KPDN.

// 1) Muatkan pemboleh ubah persekitaran dari fail .env (mesti paling atas).
require("dotenv").config();

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport");

const connectDB = require("./config/db");
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// 2) Sambung ke pangkalan data MongoDB.
connectDB();

// 3) Tetapkan enjin paparan EJS + susun atur (layout).
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // views/layout.ejs sebagai rangka utama

// 4) Middleware terbina dalam.
app.use(express.urlencoded({ extended: true })); // baca data borang (req.body)
app.use(express.json()); // baca JSON (untuk REST API)
app.use(express.static(path.join(__dirname, "public"))); // fail statik (css, imej)
app.use(methodOverride("_method")); // benarkan borang hantar PUT/DELETE

// 5) Sesi & flash message (mesej sekali papar selepas redirect).
app.use(
  session({
    secret: process.env.SESSION_SECRET || "rahsia-kpdn",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());
app.use(passport.initialize()); // mulakan Passport
app.use(passport.session()); // sambungkan Passport ke sesi Express

// Jadikan mesej flash & laluan semasa tersedia di semua paparan EJS.
app.use((req, res, next) => {
  res.locals.jaya = req.flash("jaya");
  res.locals.gagal = req.flash("gagal");
  res.locals.currentPath = req.path;
  next();
});

// 6) Daftarkan laluan.
app.use("/", webRoutes);
app.use("/api", apiRoutes);

// 7) Halaman 404 (tiada laluan padan).
app.use((req, res) => {
  res
    .status(404)
    .render("404", { title: "Halaman Tidak Dijumpai", layout: "layout" });
});

// 7b) Pengendali ralat — termasuk ralat muat naik fail (multer).
//     Mesti ada 4 parameter (err, req, res, next).
app.use((err, req, res, next) => {
  console.error("❌ Ralat:", err.message);
  // Untuk ralat muat naik, kembali ke halaman sebelumnya dengan mesej.
  if (req.flash) {
    req.flash("gagal", err.message || "Ralat tidak dijangka.");
    return res.redirect(req.get("Referrer") || "/");
  }
  res.status(500).send("Ralat pelayan: " + err.message);
});

// 8) Mulakan pelayan.
app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
