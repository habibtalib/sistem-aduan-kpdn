// models/Pengguna.js
// Skema dan model Mongoose untuk pengguna sistem (pentadbir/kakitangan).
// Kata laluan disimpan dalam bentuk hash (bcrypt), bukan teks biasa.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const penggunaSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
    },
    email: {
      type: String,
      required: [true, "E-mel wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Kata laluan wajib diisi"],
      minlength: [6, "Kata laluan mesti sekurang-kurangnya 6 aksara"],
      select: false, // jangan pulangkan password secara lalai dalam query
    },
  },
  { timestamps: true }
);

// Hook 'pre save': hash kata laluan sebelum simpan, hanya jika ia berubah.
penggunaSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Kaedah bantu: bandingkan kata laluan teks biasa dengan hash tersimpan.
penggunaSchema.methods.comparePassword = function (kataLaluan) {
  return bcrypt.compare(kataLaluan, this.password);
};

module.exports = mongoose.model("Pengguna", penggunaSchema);
