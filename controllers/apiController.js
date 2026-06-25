// controllers/apiController.js
// Logik untuk REST API (memulangkan JSON, bukan HTML).
// Berguna untuk aplikasi mobile, frontend SPA, atau integrasi sistem lain.

const Aduan = require("../models/Aduan");

/**
 * GET /api/aduan — senarai semua aduan dalam format JSON.
 */
exports.index = async (req, res) => {
  const senarai = await Aduan.find().sort({ createdAt: -1 });
  res.json({
    jumlah: senarai.length,
    data: senarai,
  });
};

/**
 * GET /api/aduan/:id — satu aduan dalam format JSON.
 */
exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);
  if (!aduan) {
    return res.status(404).json({ mesej: "Aduan tidak dijumpai" });
  }
  res.json({ data: aduan });
};

/**
 * POST /api/aduan — cipta aduan baru dari badan permintaan JSON.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.create(req.body);
    res.status(201).json({ mesej: "Aduan dicipta", data: aduan });
  } catch (error) {
    res.status(400).json({ mesej: "Gagal cipta aduan", ralat: error.message });
  }
};

/**
 * PUT /api/aduan/:id — kemaskini aduan.
 */
exports.update = async (req, res) => {
  try {
    const aduan = await Aduan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!aduan) {
      return res.status(404).json({ mesej: "Aduan tidak dijumpai" });
    }
    res.json({ mesej: "Aduan dikemaskini", data: aduan });
  } catch (error) {
    res.status(400).json({ mesej: "Gagal kemaskini", ralat: error.message });
  }
};

/**
 * DELETE /api/aduan/:id — padam aduan.
 */
exports.destroy = async (req, res) => {
  const aduan = await Aduan.findByIdAndDelete(req.params.id);
  if (!aduan) {
    return res.status(404).json({ mesej: "Aduan tidak dijumpai" });
  }
  res.json({ mesej: "Aduan dipadam" });
};
