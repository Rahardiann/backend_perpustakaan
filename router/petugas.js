const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const md5 = require("md5")
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// end point data petugas
// create
app.get("/", (req, res) => {
    //create sql query
    let sql = "select * from petugas"

    // run query
    db.query(sql, (error,result) => {
        let response = null
        if (error) {
            response = {
                message: error.message //pesan error
            }
        } else {
            response = {
                count: result.length, //jumlah data
                petugas: result //isi data
            }
        }
        res.json(response) //kirim response
    })
})

// search id
app.get("/:id", (req, res) => {
    let data = {
        id_petugas: req.params.id
    }
    // create sql query
    let sql = "select * from petugas where ?"

    // run query
    db.query(sql, data, (error,result) => {
        if(error){
            response = {
                message: error.message// pesan error
            }
        }else {
            response = {
                count: result.length,// jumlah data
                petugas: result //isi data
            }
        }
        res.json(response)
    })
})

// read
app.post("/", (req, res) => {

    // prepare data
    let data = {
        user: req.body.user,
        nama_petugas: req.body.nama_petugas,
        password: md5(req.body.password),
        status: req.body.status
    }

    // create sql query insert
    let sql = "insert into petugas set ?"

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
            user: req.body.user,
            nama_petugas: req.body.nama_petugas,
            password: req.body.password,
            status: req.body.status
        },

        // parameter (primary key)
        {
            id_petugas: req.body.id_petugas
        }
    ]

    // create sql query update
    let sql ="update petugas set ? where ?"
    
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
        id_petugas: req.params.id
    }

    // create query sql delete
    let sql = "delete from petugas where ?"

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