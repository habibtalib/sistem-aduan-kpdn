// controllers/authController.js
// Mengawal aliran log masuk & log keluar pengguna sistem.

const Pengguna = require("../models/Pengguna");

// Papar borang log masuk.
exports.showLogin = (req, res) => {
  res.render("auth/login", {
    title: "Log Masuk",
    nilai: {},
    ralat: null,
  });
};

// Proses log masuk.
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kata laluan disembunyikan secara lalai (select:false), jadi minta secara eksplisit.
    const pengguna = await Pengguna.findOne({ email: (email || "").toLowerCase() }).select(
      "+password"
    );

    // Gunakan mesej am yang sama untuk e-mel/kata laluan salah (elak bocor maklumat).
    if (!pengguna || !(await pengguna.comparePassword(password || ""))) {
      return res.status(401).render("auth/login", {
        title: "Log Masuk",
        nilai: { email },
        ralat: "E-mel atau kata laluan tidak sah.",
      });
    }

    // Simpan maklumat ringkas pengguna dalam sesi (tanpa kata laluan).
    req.session.user = {
      id: pengguna.id,
      nama: pengguna.nama,
      email: pengguna.email,
    };

    res.redirect("/pengguna");
  } catch (error) {
    res.status(500).render("auth/login", {
      title: "Log Masuk",
      nilai: { email },
      ralat: "Ralat pelayan. Sila cuba lagi.",
    });
  }
};

// Log keluar: musnahkan sesi.
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
