// middleware/errorHandler.js
// Dua pengendali ralat global: 404 (tiada laluan) dan 500 (ralat pelayan).

// Dipanggil apabila tiada laluan yang padan — mesti SELEPAS semua route.
exports.notFound = (req, res) => {
  res.status(404).render("404", { title: "Halaman Tidak Dijumpai", layout: "layout" });
};

// Mesti ada tepat 4 parameter supaya Express kenal ini sebagai pengendali ralat.
exports.errorHandler = (err, req, res, next) => {
  console.error("❌ Ralat pelayan:", err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;

  // Untuk ralat muat naik fail (multer) atau ralat ringan: redirect dengan flash.
  if (statusCode < 500 && req.flash) {
    req.flash("gagal", err.message || "Ralat tidak dijangka.");
    return res.redirect(req.get("Referrer") || "/");
  }

  // Ralat pelayan sebenar: papar halaman 500.
  res.status(statusCode).render("500", {
    title: "Ralat Pelayan",
    layout: "layout",
    mesej: process.env.NODE_ENV === "production" ? null : err.message,
  });
};
