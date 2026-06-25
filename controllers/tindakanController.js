// controllers/tindakanController.js
// Logik untuk tindakan susulan (catatan siasatan) bagi sesuatu aduan.

const Aduan = require("../models/Aduan");
const Tindakan = require("../models/Tindakans");

/**
 * Rekod satu tindakan baharu untuk satu aduan.
 * Jika statusBaru diberi, kemas kini juga status aduan tersebut.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.findById(req.params.id);
    if (!aduan) {
      req.flash("gagal", "Aduan tidak dijumpai.");
      return res.redirect("/aduan");
    }

    // Cipta tindakan yang merujuk kepada aduan ini.
    await Tindakan.create({
      aduan: aduan.id,
      catatan: req.body.catatan,
      pegawai: req.body.pegawai,
      statusBaru: req.body.statusBaru || undefined,
    });

    // Jika pegawai pilih status baharu, kemas kini aduan.
    if (req.body.statusBaru) {
      aduan.status = req.body.statusBaru;
      await aduan.save();
    }

    req.flash("jaya", "Tindakan susulan berjaya direkod.");
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    req.flash("gagal", error.message);
    res.redirect(`/aduan/${req.params.id}`);
  }
};
