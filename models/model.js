const mongoose = require('mongoose')

const categoriesModel = new mongoose.Schema(
    {
        type:{type:String,default:"Investment"},
        color:{type:String,default:"#FCBE44"},
        
    }
)
const transactionModel = new mongoose.Schema(
    {
        type:{type:String,default:"Anonymous"},
        name:{type:String,default:"Investment"},
        amount:{type:Number},
        username:{
            type:String,
            required:true,
            min:3,
            max:20,
            unique:true
        },
        date:{type:String,default:Date.now},
        
    }
)
const userModel = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    
    password:{
        type:String,
        required:true,
        min:6,
    },
    
})


const categories = mongoose.model('Categories',categoriesModel)
const transaction = mongoose.model('Transaction',transactionModel)
const users = mongoose.model('User',userModel)

exports.default = transaction;

module.exports ={
    transaction,
    categories,
    users
}