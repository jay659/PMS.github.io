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


//add new password
route.post('/',checkemailuser,(req,res,next)=>{
    var loginUser=localStorage.getItem('login_user');
    var pass_cat=req.body.pass_cat;
    var password_details= req.body.pass_details;
    var password_project_name=req.body.pass_project;
    
    var password_details=new password({
      passwordCatagory:pass_cat,
      passworddetail:password_details,
      projectDetail:password_project_name,
    });
    password_details.save((err,doc)=>{
   
      
      password_catagorydetails.exec((err,data)=>{
        if(err) throw err;
        
        res.render('addnewpassword',{title:'Password Management System',loginuser:loginUser,records:data,success:'password details insertes succesfully'});
      });
  
    });
  });

  // add new password
route.get('/',checkemailuser,(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
    password_catagorydetails.exec((err,data)=>{
      if(err) throw err;
      res.render('addnewpassword',{title:'Password Management System',loginuser:loginUser,records:data,success:''});
    });
  });


  module.exports = route;