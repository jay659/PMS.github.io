const  mongoose = require('mongoose');
const conn=mongoose.Collection;

const passwordchema=new mongoose.Schema(
    {
        passwordCatagory :{
            type:String,
            required:true,
           
        },
        passworddetail :{
            type:String,
            required:true,
           
        },
        projectDetail:{
            type:String,
            required:true
        },
       
        Date:{
            type:Date,
            default:Date.now,
        }
        
        
    }
);

module.exports= mongoose.model('password',passwordchema);

