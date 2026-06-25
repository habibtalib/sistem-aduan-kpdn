// seed.js
// Skrip untuk mengisi pangkalan data dengan data contoh.
// Jalankan dengan: npm run seed

require("dotenv").config();
const mongoose = require("mongoose");
const Aduan = require("./models/Aduan");
const Pengguna = require("./models/Pengguna");

// Pengguna pentadbir lalai untuk log masuk (kata laluan di-hash oleh model).
const penggunaPentadbir = {
  nama: "Pentadbir KPDN",
  email: "admin@kpdn.gov.my",
  password: "kata123",
};

const dataContoh = [
  {
    namaPengadu: "Ahmad bin Ismail",
    noIc: "880102145566",
    telefon: "0123456789",
    email: "ahmad@contoh.com",
    kategori: "Harga Tidak Berpatutan",
    premis: "Kedai Runcit Maju Jaya",
    lokasi: "No 12, Jalan Besar, 05000 Alor Setar, Kedah",
    butiran:
      "Harga minyak masak dijual jauh lebih tinggi daripada harga siling yang ditetapkan.",
    status: "Baru",
  },
  {
    namaPengadu: "Siti Nurhaliza binti Aziz",
    noIc: "900505106677",
    telefon: "0198887766",
    email: "siti@contoh.com",
    kategori: "Penyukatan & Penimbangan",
    premis: "Pasar Borong Selatan",
    lokasi: "Lot 8, Pasar Borong, 43300 Seri Kembangan, Selangor",
    butiran:
      "Berat ikan yang dibeli tidak sama dengan paparan penimbang. Disyaki timbang tidak tepat.",
    status: "Dalam Siasatan",
  },
  {
    namaPengadu: "Tan Chee Keong",
    noIc: "850808085544",
    telefon: "0167778899",
    kategori: "Barang Kawalan",
    premis: "Stesen Minyak Petro Laju",
    lokasi: "KM 5, Lebuhraya Utama, 81100 Johor Bahru, Johor",
    butiran:
      "Premis enggan menjual gas memasak bersubsidi kepada pengguna individu.",
    status: "Selesai",
  },
  {
    namaPengadu: "Rajesh a/l Kumar",
    noIc: "920303074433",
    telefon: "0134445566",
    email: "rajesh@contoh.com",
    kategori: "Penipuan Pengguna",
    premis: "Kedai Elektrik Cahaya",
    lokasi: "No 3, Taman Sentosa, 10400 Pulau Pinang",
    butiran:
      "Barangan elektrik yang dibeli adalah tiruan walaupun dilabel sebagai jenama asli.",
    status: "Baru",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Bersambung ke MongoDB...");

    // Kosongkan data lama supaya tidak berganda setiap kali seed.
    await Aduan.deleteMany({});
    console.log("Data lama dipadam.");

    // Gunakan gelung supaya hook 'pre save' (penjana noAduan) berjalan untuk setiap dokumen.
    for (const data of dataContoh) {
      await Aduan.create(data);
    }

    console.log(`✅ ${dataContoh.length} aduan contoh berjaya dimasukkan.`);

    // Cipta semula pengguna pentadbir lalai (gunakan .create supaya hook hash berjalan).
    await Pengguna.deleteMany({});
    await Pengguna.create(penggunaPentadbir);
    console.log(
      `✅ Pengguna pentadbir: ${penggunaPentadbir.email} / ${penggunaPentadbir.password}`
    );
  } catch (error) {
    console.error("❌ Ralat semasa seed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();
