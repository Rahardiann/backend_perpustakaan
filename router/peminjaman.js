const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const app = express()
const moment = require("moment")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


// data pelanggaran siswa(TRANSAKSI)
// create
app.post("/", (req,res) => {
    // prepare data to pelanggaran siswa
    let data = {
        id_siswa: req.body.id_siswa,
        id_petugas: req.body.id_petugas,
        tgl_pinjam: moment().format('YYYY-MM-DD HH:mm:ss') //get curent time
    }

    // parse to JSON
    let buku = JSON.parse(req.body.buku)

    // create query insert to pelanggaran_siswa
    let sql = "insert into peminjaman set ?"

    // res.json({sql, data})

    // run query
    db.query(sql, data, (error, result) => {
        let response = null

        if (error) {
            res.json({message: error.message})
        } else {

            // get last inserted id_pelanggan
            let lastID = result.insertId

            // prepare data to detail_pelanggan
            let dataPeminjaman = []
            for (const item of buku){
                dataPeminjaman.push([lastID, item.id_buku]);
            }

            // create query
            let sql = "insert into detail_peminjaman (id_peminjaman, id_buku) values ?"

            db.query(sql, [dataPeminjaman], (error, result) => {
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "data has been inserted"})
                }
            })
        }
    })
})



// end point menampilkan data pelanggaran siswa
// read 
app.get("/", (req,res) => {
    
    let data = {peminjaman: req.params.peminjaman}
    // create sql query
    let sql = "select p.id_pinjam, p.id_siswa, p.tgl_pinjam, s.nama_siswa, s.nis, petugas.id_petugas, petugas.nama_petugas " +
    "from peminjaman p join siswa s on p.id_siswa = s.id_siswa " +
    "join petugas pt on petugas.id_petugas =petugas.id_petugas"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            res.json({
                count: result.length,
                peminjaman: result
            })
        }
    })
})

// search id pelanggaran_siswa
app.get("/:id_peminjaman", (req,res) => {
    let params = { id_peminjaman: req.params.id_peminjaman}

    // create sql query
    let sql = "select p.judul, p.nama_pengarang, p.kondisi_buku, p.jumlah_halaman " +
    "from detail_peminjaman dp join buku p " +
    "on b.id_buku = dps.id.buku " +
    "where ?"

    db.query(sql, params, (error, result) => {
        if (error) {
            res.json({message: error.message})
        } else {
            res.json({
                count: result.length,
                detail_peminjaman: result
            })
        }
    })
})

module.exports = app