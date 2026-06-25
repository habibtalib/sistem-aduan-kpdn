// config/multer.js
// Konfigurasi multer untuk muat naik fail (lampiran bukti aduan).

const multer = require("multer");
const path = require("path");

// Simpan fail ke public/uploads dengan nama unik.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: (req, file, cb) => {
    // Nama unik: masa + nombor rawak + sambungan asal.
    const unik = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `lampiran-${unik}${path.extname(file.originalname)}`);
  },
});

// Hanya benarkan imej & PDF, maksimum 5MB setiap fail.
function fileFilter(req, file, cb) {
  const dibenarkan = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (dibenarkan.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya fail imej (JPG/PNG/GIF) atau PDF dibenarkan."));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
