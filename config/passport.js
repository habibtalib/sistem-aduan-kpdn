// config/passport.js
// Konfigurasi Passport.js dengan strategi tempatan (username + kata laluan).

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

// Strategi tempatan: cari pengguna mengikut username, sahkan kata laluan.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Username tidak dijumpai." });
      }

      const padanan = await user.sahkanKataLaluan(password);
      if (!padanan) {
        return done(null, false, { message: "Kata laluan tidak betul." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Simpan id pengguna ke dalam sesi selepas berjaya log masuk.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Ambil semula pengguna dari pangkalan data menggunakan id dalam sesi.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
