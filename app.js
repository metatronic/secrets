require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 10;


app = new express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {

        bcrypt.hash(req.body.password, saltrounds, (err, hash) => {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save((err) => {
                if (!err) {
                    res.render("secrets");
                } else {
                    console.log(err);
                }
            })
        })
    });
app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ email: username }, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, (err, result) => {
                        if (result === true) {
                            res.render("secrets");
                        }
                    })
                }
            }
        })
    })

app.listen(3000, () => console.log("Server started at 3000"));