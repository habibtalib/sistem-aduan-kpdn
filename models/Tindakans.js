// models/Tindakan.js
// Satu "tindakan susulan" (catatan siasatan) untuk sesuatu aduan.
// Menunjukkan HUBUNGAN data: setiap Tindakan merujuk kepada satu Aduan.

const mongoose = require("mongoose");
const { STATUS } = require("./Aduan");

const tindakanSchema = new mongoose.Schema(
  {
    // Rujukan (reference) ke dokumen Aduan — inilah "hubungan" itu.
    aduan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aduan", // nama model yang dirujuk
      required: true,
    },
    catatan: {
      type: String,
      required: [true, "Catatan tindakan wajib diisi"],
      trim: true,
    },
    pegawai: {
      type: String,
      required: [true, "Nama pegawai wajib diisi"],
      trim: true,
    },
    // (Pilihan) tukar status aduan apabila tindakan direkod.
    statusBaru: {
      type: String,
      enum: STATUS,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tindakan", tindakanSchema);
