// routes/api.js
// Laluan REST API (memulangkan JSON). Semua laluan berawalan /api (lihat server.js).

const express = require("express");
const router = express.Router();
const api = require("../controllers/apiController");

router.get("/aduan", api.index); //         GET    /api/aduan
router.post("/aduan", api.store); //        POST   /api/aduan
router.get("/aduan/:id", api.show); //      GET    /api/aduan/:id
router.put("/aduan/:id", api.update); //    PUT    /api/aduan/:id
router.delete("/aduan/:id", api.destroy); // DELETE /api/aduan/:id

module.exports = router;
