require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app = new express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const User = new mongoose.model("User",userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req,res)=>{
        const newUser = new User({
            email:req.body.username,
            password:req.body.password
        });
        newUser.save((err)=>{
            if(!err){
                res.render("secrets");
            }else{
                console.log(err);
            }
        })
    });
app.route("/login")
    .get((req,res)=>{
        res.render("login");
    })
    .post((req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({email:username},(err,foundUser)=>{
            if(err){
                console.log(err);
            }else{
                if(foundUser){
                    if(foundUser.password===password){
                        res.render("secrets");
                    }
                }
            }
        })
    })

app.listen(3000, () => console.log("Server started at 3000"));