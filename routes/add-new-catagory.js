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


//add new catagory
route.get('/',checkemailuser,(req,res,next)=>{
    var loginUser=localStorage.getItem('login_user');
      res.render('addnewCatagory',{title:'Password Management System',loginuser:loginUser,errors:'',success:''});
  })

  //add password catagory
route.post('/',checkemailuser,[check('passwordcatagory','enter password catagory name').isLength({ min: 1 })],(req,res,next)=>{
    var loginUser=localStorage.getItem('login_user');
    const errors = validationResult(req);
  
   
  
          if(!errors.isEmpty()){//if it is empty //and here error is 'enter password catagory name'
            res.render('addnewCatagory',{title:'Password Management System',loginuser:loginUser,errors:errors.mapped(),success:''});
          }else{//empty na hoy to
            var passwordcatname=req.body.passwordcatagory;
                  var passwordcatdetails=new passwordmodel({
                    passwordCatagory:passwordcatname,
                  });
                  passwordcatdetails.save((err,data)=>{
                    if(err) throw err;
                    res.render('addnewCatagory',{title:'Password Management System',loginuser:loginUser,errors:'',success:'password catagory inserted'});
            });
          
        }
  });
  module.exports = route;