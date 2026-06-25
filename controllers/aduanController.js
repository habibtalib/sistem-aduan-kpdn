// controllers/aduanController.js (Hari 2)
// Pada hari ini kita bina operasi Cipta (Create) dan Baca (Read).
// Kemaskini (Update) dan Padam (Delete) akan ditambah pada Hari 3.

const Aduan = require("../models/Aduan");
const Tindakan = require("../models/Tindakan");

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
    PRIORITI: Aduan.PRIORITI,
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
      PRIORITI: Aduan.PRIORITI,
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
    req.flash("gagal", "Aduan tidak dijumpai.");
    return res.redirect("/aduan");
  }

  // Muatkan tindakan susulan yang berkaitan dengan aduan ini (hubungan data).
  const senaraiTindakan = await Tindakan.find({ aduan: aduan.id }).sort({
    createdAt: -1,
  });

  res.render("aduan/show", {
    title: aduan.noAduan,
    aduan,
    senaraiTindakan,
    STATUS: Aduan.STATUS,
  });
};

/**
 * Papar borang kemaskini aduan.
 */
exports.edit = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    req.flash("gagal", "Aduan tidak dijumpai.");
    return res.redirect("/aduan");
  }

  res.render("aduan/edit", {
    title: `Kemaskini ${aduan.noAduan}`,
    aduan,
    KATEGORI: Aduan.KATEGORI,
    STATUS: Aduan.STATUS,
    PRIORITI: Aduan.PRIORITI,
    ralat: null,
  });
};

/**
 * Kemaskini aduan sedia ada.
 */
exports.update = async (req, res) => {
  try {
    const aduan = await Aduan.findById(req.params.id);
    if (!aduan) {
      req.flash("gagal", "Aduan tidak dijumpai.");
      return res.redirect("/aduan");
    }

    // Tetapkan nilai baru dan simpan (supaya validasi skema berjalan).
    aduan.set(req.body);
    await aduan.save();

    req.flash("jaya", "Aduan berjaya dikemaskini.");
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    const aduan = await Aduan.findById(req.params.id);
    res.status(400).render("aduan/edit", {
      title: `Kemaskini ${aduan.noAduan}`,
      aduan: { ...aduan.toObject(), ...req.body, id: aduan.id },
      KATEGORI: Aduan.KATEGORI,
      STATUS: Aduan.STATUS,
      PRIORITI: Aduan.PRIORITI,
      ralat: ambilRalat(error),
    });
  }
};

/**
 * Padam aduan.
 */
exports.destroy = async (req, res) => {
  await Aduan.findByIdAndDelete(req.params.id);
  req.flash("jaya", "Aduan berjaya dipadam.");
  res.redirect("/aduan");
};

/**
 * Papar papan pemuka (dashboard) dengan statistik ringkas.
 */
exports.dashboard = async (req, res) => {
  const jumlah = await Aduan.countDocuments();
  const baru = await Aduan.countDocuments({ status: "Baru" });
  const siasatan = await Aduan.countDocuments({ status: "Dalam Siasatan" });
  const selesai = await Aduan.countDocuments({ status: "Selesai" });
  const terkini = await Aduan.find().sort({ createdAt: -1 }).limit(5);

  // Tindakan terkini — guna populate() untuk muatkan maklumat aduan berkaitan.
  const tindakanTerkini = await Tindakan.find()
    .populate("aduan", "noAduan namaPengadu") // ambil hanya 2 medan dari Aduan
    .sort({ createdAt: -1 })
    .limit(5);

  res.render("index", {
    title: "Papan Pemuka",
    statistik: { jumlah, baru, siasatan, selesai },
    terkini,
    tindakanTerkini,
  });
};

/**
 * Muat naik fail lampiran (bukti) untuk satu aduan.
 * Fail dikendalikan oleh middleware multer; di sini kita simpan namanya.
 */
exports.muatNaikLampiran = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);
  if (!aduan) {
    req.flash("gagal", "Aduan tidak dijumpai.");
    return res.redirect("/aduan");
  }

  if (req.files && req.files.length > 0) {
    const namaFail = req.files.map((f) => f.filename);
    aduan.lampiran.push(...namaFail);
    await aduan.save();
    req.flash("jaya", `${namaFail.length} lampiran berjaya dimuat naik.`);
  } else {
    req.flash("gagal", "Tiada fail dipilih.");
  }

  res.redirect(`/aduan/${aduan.id}`);
};
