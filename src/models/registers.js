require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'Please enter your first name']
    },
    lastname:{
        type: String,
        required: [true, 'Please enter your last name']
    },
    email:{
        type: String,
        required: [true, 'Please enter your first name'],
        unique:[true, 'email is already taken']
    },
    gender:{
        type: String,
        required: [true, 'Please enter your first name']
    },
    phone:{
        type: Number,
        required: [true, 'Please enter your first name'],
        unique:[true, 'phone is already taken']
    },
    address:{
        type: String,
        required: [true, 'Please enter your first name']
    },
    age:{
        type: Number,
        required: [true, 'Please enter your first name']
    },
    password:{
        type: String,
        required: [true, 'Please enter your first name']
    },
    confirmpassword:{
        type: String,
        required: [true, 'Please enter your first name']
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]

})
//Token middleware
const jwt = require('jsonwebtoken');
userSchema.methods.generateAuthToken = async function() {
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        // console.log('The jwtToken is ' + token);
        await this.save();
        return token;
    }catch(error){
        console.log(error.message);
    }
    
},


//pre-middleware -- hashing password
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the hash password is ${this.password}`)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);;
    }
    next();
})

//we need to create a collections.

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;