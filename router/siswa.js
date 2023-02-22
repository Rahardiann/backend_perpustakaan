const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const md5 = require("md5")
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// end-point data siswa
// read
app.get("/", (req,res) => {
    
    let sql = "select * from siswa"

    db.query(sql, (error,result) => {
        let response = null 
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                siswa: result
            }
        }
        res.json(response)
    })
})

// search id
app.get("/:id", (req, res) => {
    let data = {
        id_siswa: req.params.id
    }
    // create sql query
    let sql = "select * from siswa where ?"

    // run query
    db.query(sql, data, (error,result) => {
        if(error){
            response = {
                message: error.message// pesan error
            }
        }else {
            response = {
                count: result.length,// jumlah data
                siswa: result //isi data
            }
        }
        res.json(response)
    })
})

// create
app.post("/", (req, res) => {

    // prepare data
    let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        no_absen: req.body.no_absen
    }

    // create sql query insert
    let sql = "insert into siswa set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + "data inserted"
            }
        }
        res.json(response)
    })
})

// update
app.put("/", (req, res) => {


    // prepare data
    let data = [
        // data
        {
            nis: req.body.nis,
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            no_absen: req.body.no_absen

        },

        // parameter (primary key)
        {
            id_siswa: req.body.id_siswa
        }
    ]

    // create sql query update
    let sql ="update siswa set ? where ?"
    
    // run query
    db.query(sql,data, (error,result) => {
        let response = null
        if(error) {
            response = {
                message: error.message
            }
        }else {
            response = {
                message: result.affectedRows + "data updated"
            }
        }
        res.json(response)
    })
})


// delete
app.delete("/:id", (req,res) => {
    // prepare data
    let data = {
        id_siswa: req.params.id
    }

    // create query sql delete
    let sql = "delete from siswa where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response =null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(response)
    })
})



module.exports = app