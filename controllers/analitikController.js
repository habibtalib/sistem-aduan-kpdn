// controllers/analitikController.js
// Analitik menggunakan "aggregation pipeline" MongoDB.

const Aduan = require("../models/Aduan");

/**
 * Papar halaman analitik:
 *  - Bilangan aduan mengikut kategori
 *  - Bilangan aduan mengikut bulan (trend)
 */
exports.index = async (req, res) => {
  // 1) Kumpulkan & kira aduan mengikut kategori.
  const ikutKategori = await Aduan.aggregate([
    { $group: { _id: "$kategori", jumlah: { $sum: 1 } } },
    { $sort: { jumlah: -1 } },
  ]);

  // 2) Kumpulkan & kira aduan mengikut bulan (YYYY-MM).
  const ikutBulan = await Aduan.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        jumlah: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.render("analitik", {
    title: "Analitik",
    // Hantar data sebagai JSON untuk digunakan oleh Chart.js di pelayar.
    kategoriLabel: ikutKategori.map((k) => k._id),
    kategoriData: ikutKategori.map((k) => k.jumlah),
    bulanLabel: ikutBulan.map((b) => b._id),
    bulanData: ikutBulan.map((b) => b.jumlah),
  });
};
