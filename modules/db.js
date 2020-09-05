const mongoose = require('mongoose');
const conn=mongoose.Collection;
const userschems=new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true,
            index:{
                unique:true
            }
        },
        eMail:{
            type:String,
            required:true,
            index:{
                unique:true
            }
        },
        password:{
            type:String,
            required:true,
        },
        Date:{
            type:Date,
            default:Date.now,
        }
        
        
    }
);

module.exports= mongoose.model('details',userschems);

