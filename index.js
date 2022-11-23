const express = require("express")
const app = express()
const axios = require("axios")
const mongoose = require("mongoose")
let cors = require("cors")
const UserModel = require("./models/UserModel")
require("dotenv").config()
const bcrypt = require("bcrypt")
const path = require("path")
//const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors({origin: true, credentials: true}))

let loggedInUser = null

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
//console.log(process.env.TOKEN)

app.post("/login", async (req, res) => {
    const {username, password} = req.body

    const user = await UserModel.findOne({username})
    loggedInUser = user
    if(!user) {
        return res.status(200).json("error-noUser")
    }
    const checkPasswords = await bcrypt.compare(password, user.password)
    if(!checkPasswords) {
        return res.status(200).json("error")
    } else {
        //console.log(user)
        //const token = jwt.sign(user.name, process.env.TOKEN)*/
        res.status(200).json(user)
        
    }
})

app.get("/users", async (req, res) => {
    const users = await UserModel.find({})
    res.status(200).json(users)
})

app.put("/notes", async (req, res) => {
    const {newNotes} = req.body
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {notes: newNotes}
        })
        res.send(202)
})

app.put("/todos", async (req, res) => {
    const {newTodos} = req.body
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {todos: newTodos}
        })
        res.send(202)
})

app.put("/dailyLogs", async (req, res) => {
    const {dailyLogs} = req.body
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {dailyLogs: dailyLogs}
        })
        
        res.status(202).json(dailyLogs)
})

app.get("/dailyLogs", async (req, res) => {
    if(loggedInUser){
        let user = await UserModel.find({username: loggedInUser.username})
        user = user[0]
        console.log(user)
        res.status(200).json(user)
    }
    else {
        res.send(405)
    }
})

app.put("/logs", async (req, res) => {
    const {dailyLogs} = req.body
    let user = await UserModel.find({username: loggedInUser.username})
    
    user = user[0]
    //console.log(user.logs, "USER LOGS")
    
    if(user.logs == false) {
        //console.log("empty", user.logs)
        let newArray = []
        newArray.push(dailyLogs)
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {logs: newArray}
        })
    }
    else if(user.logs[user.logs.length-1].date !== dailyLogs.date) {
        let newArray = []
        newArray = [...user.logs]
        newArray.push(dailyLogs)
        //console.log("USER LOGS ARRAY",newArray)
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {logs: newArray}
        })
    }
    else if(user.logs[user.logs.length-1].date === dailyLogs.date) {
        let newArray = [...user.logs]
        newArray[newArray.length-1] = dailyLogs
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {logs: newArray}
        })
    }
    res.send(202)
    
})

app.get("/logs", async (req, res) => {
    if(loggedInUser){
        let user = await UserModel.find({username: loggedInUser.username})
        user = user[0]
        res.status(200).json(user.logs)
    }
    else {
        res.send(405)
    }
})

app.put("/habits", async (req, res) => {
    const {newHabits} = req.body
        await UserModel.updateOne({username: loggedInUser.username},
            {
            $set: {habits: newHabits}
        })
        res.send(202)
})

app.get("/habits", async (req, res) => {
    if(loggedInUser){
        let user = await UserModel.find({username: loggedInUser.username})
        user = user[0]
        res.status(200).json(user.habits)
    }
    else {
        res.send(405)
    }
})

const port = 3001

if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

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