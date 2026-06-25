// models/User.js
// Model pengguna sistem dengan username, hash kata laluan, nama, dan peranan.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Kata laluan wajib diisi"],
    },
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    peranan: {
      type: String,
      enum: ["admin", "pegawai"],
      default: "pegawai",
    },
  },
  { timestamps: true }
);

// Kaedah statik: cipta pengguna baru dengan kata laluan di-hash secara automatik.
userSchema.statics.daftar = async function (username, kataLaluan, nama, peranan) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(kataLaluan, salt);
  return this.create({ username, passwordHash, nama, peranan });
};

// Kaedah instance: sahkan kata laluan berbanding hash tersimpan.
userSchema.methods.sahkanKataLaluan = function (kataLaluan) {
  return bcrypt.compare(kataLaluan, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
