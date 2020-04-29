// ******* Const
// require("dotenv").confg();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");

const app = express();
// ******* Nes. Code
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// ******* DB 
// Connection
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema/Module 

// 1 lvl sec. 
// const userSchema = 
// {
//     email: String,
//     password: String
// }

// 2 lvl sec. with mongoose-encryption
const userSchema = new mongoose.Schema
({
    email: String,
    password: String
});

// Crypto code. Use docs mongoose-encrypt
// Используется в app.js до 2 уровня 
// const secret = "Thisisoursecret";
// Все поля
// userSchema.plugin(encrypt, {secret: secret});
// Определенные поля 
// userSchema.plugin(encrypt, {secret: process.env.Secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

// ********* Get
app.get("/", function(req, res)
{
    res.render("home");
});

app.get("/login", function(req, res)
{
    res.render("login");
});

app.get("/register", function(req, res)
{
    res.render("register");
});

// ******* POST
app.post("/register", function(req, res)
{

    bcrypt.hash(req.body.username, saltRounds, function(err, hash)
    {
    const newUser = new User({
        email: req.body.username,
        password: hash
    });

    newUser.save(function(err)
    {
        if (err) {console.log(err);}
        else{res.render("secrets");}
    });
});
});

app.post("/login", function(req, res)
{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:  username}, function(err, foundUser)
    {
        if(err){console.log(err);}
        else{
            if(foundUser)
            {
                // if(foundUser.password === password)
                bcrypt.compare(password, foundUser.password  , function(err, result)
                { if (result === true) 
                {
                    res.render("secrets");
                } 
                });                                 
            }
        } 
    });
});

// Listen ports
app.listen(3000, function() 
{
    console.log("Server started on port 3000");
}); 
