// routes/web.js (Hari 2)
// Laluan untuk paparan HTML.

const express = require("express");
const router = express.Router();
const aduan = require("../controllers/aduanController");
const pengguna = require("../controllers/penggunaController");

// Halaman utama
router.get("/", (req, res) => {
  res.render("index", { title: "Utama" });
});

// CRUD Aduan — Hari 2 (Cipta & Baca sahaja)
router.get("/aduan", aduan.index); //         Senarai semua aduan
router.get("/aduan/create", aduan.create); //  Borang daftar (mesti sebelum /aduan/:id)
router.post("/aduan", aduan.store); //         Simpan aduan baru
router.get("/aduan/:id", aduan.show); //       Papar satu aduan

// CRUD Aduan — Hari 2 (Cipta & Baca sahaja)
router.get("/pengguna", pengguna.index); //         Senarai semua aduan
router.get("/pengguna/create", pengguna.create); //  Borang daftar (mesti sebelum /aduan/:id)
router.post("/pengguna", pengguna.store); //         Simpan aduan baru
router.get("/pengguna/:id", pengguna.show); //       Papar satu aduan

module.exports = router;
