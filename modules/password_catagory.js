const mongoose = require('mongoose');
const conn=mongoose.Collection;

var mongoosePaginate = require('mongoose-paginate');

const passwordschema=new mongoose.Schema(
    {
        passwordCatagory:{
            type:String,
            required:true,
           
        },
       
        Date:{
            type:Date,
            default:Date.now,
        }
        
        
    }
);
passwordschema.plugin(mongoosePaginate);
module.exports= mongoose.model('passwordsatagories',passwordschema);

