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




route.get('/',(req,res)=>{
  var loginUser=localStorage.getItem('login_user'); //it check if user is already logged in so it directly render home page insted of login
  if(loginUser){
    res.redirect('./add_new_catagory');
  }else{
    res.render('login',{title:'Password Management System',msg:''});
  }
});



//login
   route.post('/',(req,res,next)=>{
        var {uname,password}=req.body;
        if(!uname  || !password ){
        
          res.render('login',{msg:'enter all the fields',title:'Password Management System'} ); //left sidde err is a attribter and right sidei s a value
        }
            const checkUser=usermodel.findOne({userName:uname});
                checkUser.exec((err,data)=>{
                  if(err) throw err;
                  //data coming from database is in object form
                      
                      var getuserID=data._id;
                  
                  if(bcrypt.compareSync(password,data.password)){
                    var token = jwt.sign({ userID:getuserID }, 'logintoken'); //generate token for authentication

                    localStorage.setItem('user_token', token); //it will store token into local storage
                    localStorage.setItem('login_user',uname); //it is use to print user name any furthe r pages

                        res.redirect('/add_new_catagory');
                  }else{
                    res.render('login',{title:'password management system',msg:'Invalid password'});
            }
      });
  });



  
  module.exports = route;
