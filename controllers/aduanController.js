// controllers/aduanController.js (Hari 2)
// Pada hari ini kita bina operasi Cipta (Create) dan Baca (Read).
// Kemaskini (Update) dan Padam (Delete) akan ditambah pada Hari 3.

const Aduan = require("../models/Aduan");

/**
 * Papar senarai semua aduan, dengan sokongan carian.
 */
exports.index = async (req, res) => {
  const { carian } = req.query;
  const pertanyaan = {};

  if (carian) {
    pertanyaan.$or = [
      { namaPengadu: { $regex: carian, $options: "i" } },
      { noAduan: { $regex: carian, $options: "i" } },
      { premis: { $regex: carian, $options: "i" } },
    ];
  }

  const senaraiAduan = await Aduan.find(pertanyaan).sort({ createdAt: -1 });

  res.render("aduan/index", {
    title: "Senarai Aduan",
    senaraiAduan,
    carian: carian || "",
  });
};

/**
 * Papar borang daftar aduan baru.
 */
exports.create = (req, res) => {
  res.render("aduan/create", {
    title: "Daftar Aduan Baru",
    KATEGORI: Aduan.KATEGORI,
    nilai: {},
    ralat: null,
  });
};

/**
 * Simpan aduan baru ke pangkalan data.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.create(req.body);
    // Selepas berjaya simpan, terus ke halaman butiran aduan baru.
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    // Jika validasi gagal, papar semula borang dengan mesej ralat & nilai asal.
    const ralat = error.errors
      ? Object.values(error.errors).map((e) => e.message)
      : [error.message];

    res.status(400).render("aduan/create", {
      title: "Daftar Aduan Baru",
      KATEGORI: Aduan.KATEGORI,
      nilai: req.body,
      ralat,
    });
  }
};

/**
 * Papar butiran penuh satu aduan.
 */
exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    return res.status(404).render("404", { title: "Aduan Tidak Dijumpai" });
  }

  res.render("aduan/show", { title: aduan.noAduan, aduan });
};
