// routes/web.js (Hari 2 + modul log masuk)
// Laluan untuk paparan HTML.

const express = require("express");
const router = express.Router();
const aduan = require("../controllers/aduanController");
const pengguna = require("../controllers/penggunaController");
const auth = require("../controllers/authController");
const { requireLogin, requireGuest } = require("../middleware/auth");
const upload = require("../config/multer");
const analitik = require("../controllers/analitikController");
const tindakan = require("../controllers/tindakanController");
// Halaman utama
// router.get("/", (req, res) => {
//   res.render("index", { title: "Utama" });
// });

router.get("/", aduan.dashboard);
// Log masuk / Log keluar
router.get("/login", requireGuest, auth.showLogin); // Borang log masuk
router.post("/login", requireGuest, auth.login); //    Proses log masuk
router.post("/logout", auth.logout); //                Log keluar

// CRUD Aduan — awam: senarai & papar. perlu log masuk: cipta, simpan, edit, kemaskini.
router.get("/aduan", aduan.index); //                          Senarai (awam)
router.get("/aduan/create", requireLogin, aduan.create); //    Borang cipta
router.post("/aduan", requireLogin, aduan.store); //           Simpan aduan baru
router.get("/aduan/:id", aduan.show); //                       Papar satu aduan (awam)
router.get("/aduan/:id/edit", requireLogin, aduan.edit); //    Borang kemaskini
router.put("/aduan/:id", requireLogin, aduan.update); //       Kemaskini aduan

// Pengurusan Pengguna — perlu log masuk.
router.get("/pengguna", requireLogin, pengguna.index); //         Senarai semua pengguna
router.get("/pengguna/create", requireLogin, pengguna.create); //  Borang daftar (mesti sebelum /pengguna/:id)
router.post("/pengguna", requireLogin, pengguna.store); //         Simpan pengguna baru
router.get("/pengguna/:id", requireLogin, pengguna.show); //       Papar satu pengguna
router.post(
  "/aduan/:id/lampiran",
  upload.array("lampiran", 5),
  aduan.muatNaikLampiran,
);
router.get("/analitik", analitik.index);
router.post("/aduan/:id/tindakan", tindakan.store);

module.exports = router;
