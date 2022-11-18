const express = require("express")
const app = express()
const axios = require("axios")
const mongoose = require("mongoose")
let cors = require("cors")
const UserModel = require("./models/UserModel")
require("dotenv").config()
const bcrypt = require("bcrypt")

app.use(express.json())
app.use(cors({origin: true, credentials: true}))


app.get("/quote", async (req, res) => {
    let data = []
    await axios.get("https://zenquotes.io/api/today/").then(result => {
        data = result.data
    })

    res.status(200).json(data)
})

app.post("/register", (req, res) => {
    const {name, username, password} = req.body
    let hashedPassword = null

    const hashPassword = async (password) => {
        hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        insertUser()
    }

    const insertUser = () => {
            const newUser = new UserModel({
            name, username, password: hashedPassword
        })
        newUser.save((err, result) => {
            if(err) {
                console.log(err)
                return
            }
            res.status(201).json(result)
        })
    }

    hashPassword(password)
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body
    // 
    const user = await UserModel.findOne({username})
    const checkPasswords = await bcrypt.compare(password, user.password)
    if(!checkPasswords) {
        res.status(200).json("error")
    } else {
        res.status(200).json(user)
    }
})

app.get("/users", async (req, res) => {
    const users = await UserModel.find({})
    res.status(200).json(users)
})


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(3001, () => {
            console.log("Sever is listening on port 3001...")
        })
    }
    catch(err) {
        console.log("Something went wrong!")
        console.log(err)
    }
}
start()