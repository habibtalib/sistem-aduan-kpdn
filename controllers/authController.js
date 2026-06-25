// controllers/authController.js
// Mengawal aliran log masuk & log keluar menggunakan Passport.js.

const passport = require("../config/passport");

// Papar borang log masuk. Ralat dari Passport diambil melalui flash 'error'.
exports.showLogin = (req, res) => {
  res.render("login", {
    title: "Log Masuk",
    ralat: req.flash("error")[0] || null,
  });
};

// Proses log masuk — Passport uruskan semak kata laluan & sesi secara automatik.
exports.login = passport.authenticate("local", {
  successRedirect: "/aduan",
  failureRedirect: "/login",
  failureFlash: true, // hantar mesej ralat ke req.flash('error')
});

// Log keluar: Passport buang maklumat pengguna dari sesi.
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
