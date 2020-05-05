// ******* Const
// require("dotenv").confg();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");

const app = express();
// ******* Nes. Code
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Место для установки сессии, между app и mongo DB только
app.use(session({
    secret: "Our little secret ///",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ******* DB 
// Connection
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
// Fix для зависимости 
mongoose.set("useCreateIndex", true);
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

// Новая схема для пакета passportLocalMongoose и минифицированный код
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Crypto code. Use docs mongoose-encrypt
// Используется в app.js до 2 уровня 
// const secret = "Thisisoursecret";
// Все поля
// userSchema.plugin(encrypt, {secret: secret});
// Определенные поля 
// userSchema.plugin(encrypt, {secret: process.env.Secret, encryptedFields: ["password"] });

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

// Создание secret путь для того, чтобы он был доступен только во время авторизированной сессии
app.get("/secrets", function(req, res)
{
    if(req.isAuthenticated())
    {
        res.render("secrets");
    }
    else
    {
        res.redirect("/login")
    }
});

// ******* POST
app.post("/register", function(req, res)
{
    // Для bcrypt
    // bcrypt.hash(req.body.username, saltRounds, function(err, hash)
    // {
    // const newUser = new User({
    //     email: req.body.username,
    //     password: hash
    // });

    // newUser.save(function(err)
    // {
    //     if (err) {console.log(err);}
    //     else{res.render("secrets");}
    // });
// });
    User.register({username: req.body.username}, req.body.password, function(err, user)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else
        {
            passport.authenticate("local")(req, res, function()
            {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res)
{
    // const username = req.body.username;
    // const password = req.body.password;

    // User.findOne({email:  username}, function(err, foundUser)
    // {
    //     if(err){console.log(err);}
    //     else{
    //         if(foundUser)
    //         {
    //             // if(foundUser.password === password)
    //             bcrypt.compare(password, foundUser.password  , function(err, result)
    //             { if (result === true) 
    //             {
    //                 res.render("secrets");
    //             } 
    //             });                                 
    //         }
    //     } 
    // });

});

// Listen ports
app.listen(3000, function() 
{
    console.log("Server started on port 3000");
}); 
