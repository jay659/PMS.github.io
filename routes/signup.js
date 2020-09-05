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

//get method of signup
route.get('/',(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
    if(loginUser){
      res.redirect('/add_new_catagory');
    }else{
      res.render('signup',{title:'Password Management System',msg:''});
    }
      
  });


//post methods signup
route.post('/',uservalidation,emailvalidation,(req,res)=>{
    var {uname,email,password,confirmpassword}=req.body;
    if(!uname || !email || !password || !confirmpassword){
        
        res.render('signup',{msg:'enter all the fields',title:'Password Management System'} ); //left sidde err is a attribter and right sidei s a value
      }
      if(password.length<8){
       
         res.render('signup',{msg:'password length must be more than 8 characher',title:'Password Management System'});// if password does not match so automatically all fields remove to display other field we need to use it
       }
  
      if(password != confirmpassword){
       
        res.render('signup',{msg:'write correct password',title:'Password Management System'});// if password does not match so automatically all fields remove to display other field we need to use it
      }

      if( typeof msg == 'undefined'){  //use it by password
        usermodel.findOne({eMail:email},(err,user)=>{
         
          if (err) throw err;
          if(user){ //it just check user exixt or not
  
         
          msg="user already exist with this email..";
          res.render('signup',{'msg':msg,title:'Password Management System'});
          }else{ //it run when there is no user available so we need to add it into dbs..
              password=bcrypt.hashSync(password,10);
  
                  //model object
                  var userdetail=new usermodel({
                    userName:uname,
                    eMail :email,
                    password :password,
                  });
                  userdetail.save((err,data)=>{
                    console.log(data);
                    if(err) throw err;
                   
                    if(data){
                    
                      res.redirect('/add_new_catagory'  );
                     }
  
                  });
                
              
          }
  
        });
      }
    
  });
module.exports = route;