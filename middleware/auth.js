// middleware/auth.js
// Middleware untuk melindungi laluan yang memerlukan log masuk (Passport).

// Hanya benarkan jika pengguna telah disahkan oleh Passport.
exports.requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

// Sebaliknya: halang pengguna yang SUDAH log masuk daripada melihat halaman log masuk.
exports.requireGuest = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/aduan");
  next();
};
