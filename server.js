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
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// 2) Sambung ke pangkalan data MongoDB.
connectDB();

// 3) Tetapkan enjin paparan EJS + susun atur (layout).
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // views/layout.ejs sebagai rangka utama

// 4) Keselamatan.
// CSP dimatikan kerana Tailwind CSS dimuatkan dari CDN (cdn.tailwindcss.com).
// Untuk produksi: aktifkan semula CSP dan senaraikan domain CDN dalam scriptSrc/styleSrc.
app.use(helmet({ contentSecurityPolicy: false }));

// Buang aksara '$' dan '.' dari input untuk halang suntikan operator MongoDB.
app.use(mongoSanitize());

// Had cubaan log masuk: maksimum 10 percubaan setiap 15 minit bagi satu IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Terlalu banyak cubaan log masuk. Sila cuba lagi selepas 15 minit.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/login", loginLimiter);

// 5) Middleware terbina dalam.
app.use(express.urlencoded({ extended: true })); // baca data borang (req.body)
app.use(express.json()); // baca JSON (untuk REST API)
app.use(express.static(path.join(__dirname, "public"))); // fail statik (css, imej)
app.use(methodOverride("_method")); // benarkan borang hantar PUT/DELETE

// 6) Sesi & flash message (mesej sekali papar selepas redirect).
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

// Jadikan mesej flash, laluan semasa & pengguna log masuk tersedia di semua paparan EJS.
app.use((req, res, next) => {
  res.locals.jaya = req.flash("jaya");
  res.locals.gagal = req.flash("gagal");
  res.locals.currentPath = req.path;
  res.locals.currentUser = req.user || null; // Passport letak pengguna dalam req.user
  next();
});

// 7) Daftarkan laluan.
app.use("/", webRoutes);
app.use("/api", apiRoutes);

// 8) Pengendali ralat — mesti PALING AKHIR selepas semua laluan.
app.use(notFound);       // 404: tiada laluan padan
app.use(errorHandler);   // 500: ralat tidak dijangka (4 parameter)

// 9) Mulakan pelayan.
const server = app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});

// 10) Graceful shutdown: tunggu request semasa selesai sebelum tutup.
process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM diterima. Menutup pelayan...");
  server.close(() => {
    console.log("✅ Pelayan ditutup dengan selamat.");
    process.exit(0);
  });
});
