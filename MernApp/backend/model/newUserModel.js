const mongoose=require("mongoose");

const newUserSchema = new mongoose.Schema({
       address:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        }
});

const newUser = mongoose.model("newUser",newUserSchema);

module.exports = newUser;