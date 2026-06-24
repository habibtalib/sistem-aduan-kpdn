// middleware/auth.js
// Middleware untuk melindungi laluan yang memerlukan log masuk.

// Hanya benarkan jika sesi mempunyai pengguna yang telah log masuk.
exports.requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/login");
};

// Sebaliknya: halang pengguna yang SUDAH log masuk daripada melihat halaman log masuk.
exports.requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/pengguna");
  }
  return next();
};
