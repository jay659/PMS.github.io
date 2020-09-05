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

route.get('/',checkemailuser,(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
    password_catagorydetails.exec((err,data)=>{
        if(err) throw err;
        res.render('passwordCatagory',{title:'Password Management System',loginuser:loginUser,records:data});
  
      });
  })
//delete catagory
route.get('/delete/:id',checkemailuser,(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
  
    var passcat_id=req.params.id;
    // console.log(passcat_id);
    var passcatdelete=passwordmodel.findByIdAndDelete(passcat_id);
    passcatdelete.exec((err)=>{
      if(err) throw err;
      res.redirect('/password_catagory')
    });
  })
  //edit catagory get method
route.get('/edit/:id',checkemailuser,(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
  
    var passcat_id=req.params.id;
    // console.log(passcat_id);
    var getpasscatogary=passwordmodel.findById(passcat_id);
    getpasscatogary.exec((err,data)=>{
      if(err) throw err;
      console.log(data);
      res.render('edit_pass_cat',{title:'Password Management System',loginuser:loginUser,errors:'',success:'',records:data,id:passcat_id});
  
    });
  });
  
  //edit passwprd catagory

route.post('/edit/',checkemailuser,(req,res)=>{
    var loginUser=localStorage.getItem('login_user');
  
    var passcat_id=req.body.id;
    var edit_passcat=req.body.editpasswordcat;
    
    // console.log(passcat_id);
    var update_pass_cat=passwordmodel.findByIdAndUpdate(passcat_id,{ passwordCatagory:edit_passcat});//lest side is name of database attribute
    update_pass_cat.exec((err,data)=>{
      if(err) throw err;
      if(data){
        res.redirect('/password_catagory');
      }
     });
  });




module.exports = route;
