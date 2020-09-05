const express=require('express');
const route=express.Router();

const path=require('path');
const bodyparser=require('body-parser');


const mongoose= require('mongoose');

//reqire all database modele
const usermodel=require('../modules/db');
const passwordmodel=require('../modules/password_catagory');
const password=require('../modules/password');


const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
 //objext of password model
var password_catagorydetails=passwordmodel.find({});
var getallpass=password.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

mongoose.connect(
'mongodb://localhost:27017/pms',
 {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const conn=mongoose.connection;



route.use(bodyparser.urlencoded({extended:true}));
route.use(bodyparser.json());


//midlle ware for auth
function checkemailuser(req,res,next){
    var userToken=localStorage.getItem('user_token')
    try {
      var decoded = jwt.verify(userToken, 'logintoken');
    } catch(err) {
      res.redirect('/');
    }
    next();
  }
//to check email  and user

function emailvalidation(req,res,next){
  var{email}=req.body;
  var checkuser=usermodel.findOne({eMail:email},(err,user)=>{
    checkuser.exec((err,user)=>{
      if(err) throw err;
      if(user){
      return  res.render('signup',{title:'Password Management System',msg:'email already exixt'});
      }
      next();
    });
   
  })
}
function uservalidation(req,res,next){
  var{uname}=req.body;
  var checkuser=usermodel.findOne({userName:uname},(err,user)=>{
    checkuser.exec((err,user)=>{
      if(err) throw err;
      if(user){
      return  res.render('signup',{title:'Password Management System',msg:'user already exixt'});
      }
      next();
    });
   
  })
}




//show passwords
route.get('/',checkemailuser,(req,res)=>{
  var loginUser=localStorage.getItem('login_user');
  getallpass.exec((err,data)=>{

    if(err) throw err;
    else{
      res.render('viewallpassword',{title:'Password Management System',loginuser:loginUser,records:data,message:''});
    }
   
  });
   
});
// delete password 
route.get('/delete/:id',checkemailuser,(req,res,next)=>{
  var loginUser=localStorage.getItem('login_user');

  var pass_id=req.params.id;
  var delete_password=password.findByIdAndDelete(pass_id);

  delete_password.exec((err,data)=>{
   if(err) throw err;
   else{
     res.redirect('/view_all_password');
   }
  });
});
//edit password
route.get('/edit/:id',checkemailuser,(req,res,next)=>{

var loginUser=localStorage.getItem('login_user');
var id=req.params.id;
password.findById({_id :id}).exec((err,data)=>{

 password_catagorydetails.exec((err,data1)=>{
 if (err) throw err;
 res.render('edit_pass_details',{title:'Password Management System',loginuser:loginUser,success:'',record:data,records:data1,id:id});
 })
})
});

module.exports = route;