const Aduan = require("../models/Pengguna");

exports.index = async (req, res) => {
  const { carian } = req.query;
  const pertanyaan = {};

  if (carian) {
    pertanyaan.$or = [
      { nama: { $regex: carian, $options: "i" } },
      { email: { $regex: carian, $options: "i" } },
    ];
  }

  const senaraiPengguna = await Aduan.find(pertanyaan).sort({ createdAt: -1 });

  res.render("pengguna/index", {
    title: "Senarai Pengguna",
    senaraiPengguna,
    carian: carian || "",
  });
};

exports.create = (req, res) => {
  res.render("pengguna/create", {
    title: "Daftar Pengguna Baru",
    nilai: {},
    ralat: null,
  });
};

exports.store = async (req, res) => {
  try {
    const pengguna = await Aduan.create(req.body);
    res.redirect(`/pengguna/${pengguna.id}`);
  } catch (error) {
    const ralat = error.errors
      ? Object.values(error.errors).map((e) => e.message)
      : [error.message];

    res.status(400).render("pengguna/create", {
      title: "Daftar Pengguna Baru",
      nilai: req.body,
      ralat,
    });
  }
};

exports.show = async (req, res) => {
  try {
    const pengguna = await Aduan.findById(req.params.id);
    if (!pengguna) {
      return res.status(404).send("Pengguna tidak dijumpai");
    }
    res.render("pengguna/show", {
      title: "Maklumat Pengguna",
      pengguna,
    });
  } catch (error) {
    res.status(500).send("Ralat pelayan dalaman");
  }
};
