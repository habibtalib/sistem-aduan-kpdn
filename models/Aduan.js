// models/Aduan.js
// Skema dan model Mongoose untuk satu aduan pengguna KPDN.

const mongoose = require("mongoose");

// Senarai kategori aduan yang dibenarkan (gunakan semula dalam borang & validasi).
const KATEGORI = [
  "Harga Tidak Berpatutan",
  "Barang Kawalan",
  "Penyukatan & Penimbangan",
  "Penipuan Pengguna",
  "Kawalan Harga Raya",
  "Lain-lain",
];

// Senarai status aduan mengikut aliran kerja siasatan.
const STATUS = ["Baru", "Dalam Siasatan", "Selesai", "Ditolak"];

const aduanSchema = new mongoose.Schema(
  {
    // Nombor rujukan aduan, contoh: ADN-2026-0001. Dijana automatik (lihat hook di bawah).
    noAduan: {
      type: String,
      unique: true,
    },
    namaPengadu: {
      type: String,
      required: [true, "Nama pengadu wajib diisi"],
      trim: true,
    },
    noIc: {
      type: String,
      required: [true, "No. kad pengenalan wajib diisi"],
      trim: true,
    },
    telefon: {
      type: String,
      required: [true, "No. telefon wajib diisi"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    kategori: {
      type: String,
      required: [true, "Sila pilih kategori aduan"],
      enum: {
        values: KATEGORI,
        message: 'Kategori "{VALUE}" tidak sah',
      },
    },
    premis: {
      type: String,
      required: [true, "Nama premis/perniagaan wajib diisi"],
      trim: true,
    },
    lokasi: {
      type: String,
      required: [true, "Lokasi premis wajib diisi"],
      trim: true,
    },
    butiran: {
      type: String,
      required: [true, "Butiran aduan wajib diisi"],
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "Baru",
    },
  },
  {
    // Tambah medan createdAt & updatedAt secara automatik.
    timestamps: true,
  },
);

/**
 * Hook 'pre save': jana noAduan automatik sebelum dokumen baru disimpan.
 * Format: ADN-<tahun>-<nombor berturut 4 digit>, contoh ADN-2026-0007.
 */
aduanSchema.pre("save", async function (next) {
  // Hanya jana untuk dokumen baru yang belum ada noAduan.
  if (this.noAduan) return next();

  const tahun = new Date().getFullYear();
  // Kira berapa banyak aduan sedia ada untuk tahun ini.
  const bilangan = await mongoose.model("Aduan").countDocuments();
  const turutan = String(bilangan + 1).padStart(4, "0");
  this.noAduan = `ADN-${tahun}-${turutan}`;
  next();
});

// Eksport model dan senarai pilihan supaya boleh digunakan di controller & view.
module.exports = mongoose.model("Aduan", aduanSchema);
module.exports.KATEGORI = KATEGORI;
module.exports.STATUS = STATUS;
