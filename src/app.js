require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const connectdb = require("../src/db/conn");
const PORT = process.env.PORT || 5005 ;
const hbs = require('hbs');
const bcrypt = require('bcrypt');




connectdb();
const Register = require('../src/models/registers')


const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

// app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs")
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res)=>{
    // res.send("Hello from server")
    res.render("index")  // from handler bars
});

app.get("/register", (req, res)=>{
    res.render("register");
})

//Create new user 
app.post("/register", async (req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword){
            const registeredUser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender:req.body.gender,
                age:req.body.age,
                phone:req.body.phonenumber,
                password: password,
                confirmpassword: cpassword,
                address: req.body.address
            })
            console.log(`The registerred user is ${registeredUser}`);
            //Token middleware

            const token = await registeredUser.generateAuthToken();
            console.log("The token part "+ token);


            //middleware -- password hash
            // save method

            const registered = await registeredUser.save();
            console.log("The page part "+ registered);
            res.status(201).render("index");
        }else{
            res.send("Passwords are not matching.")
        }
    }catch(error){
        res.status(400).send(error.message);
    }
})

app.get("/login", (req, res)=>{
    // res.send("Hello from server")
    res.render("login")  // from handler bars
});

app.post("/login", async (req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        //use bcrypt to compare input password with hash password stored in database.
        const isMatch = await bcrypt.compare(password, useremail.password);

        //Generte Token:
        const token = await useremail.generateAuthToken();
        console.log("The token part "+ token);

        if(isMatch){
            console.log(useremail)
            res.status(200).render("index");
        }else{
            res.send("invalid login details")
        }
    }catch(err){
        res.status(400).send("invalid login details")
    }
})


//JsonWebToken

// const jwt = require('jsonwebtoken');

// const createToken = async () => {
//     const token = await jwt.sign({_id:"641149b93569e7234fb96f82"}, "Hellllooohhhhehrerecdfddfddfd",{
//         expiresIn:"60 seconds"
//     });
//     console.log(token);
//     const userVerify = await jwt.verify(token, "Hellllooohhhhehrerecdfddfddfd");
//     console.log(userVerify);

// }

// createToken();


app.listen(PORT, ()=>{
    console.log(`server is listening at ${PORT}`)
});