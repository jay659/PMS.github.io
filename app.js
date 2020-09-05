const express=require('express');
const app=express();

const routes=require('./routes/login');

const signup_route=require('./routes/signup');

const addnewcatagory_route=require('./routes/add-new-catagory');
const viewcatagory_route=require('./routes/view-catagory');
const addnewpassword_route=require('./routes/add-new-password');
const viewallpassword_route=require('./routes/viewpassword');
const passwordedit_route=require('./routes/password_edit');
const logout_route=require('./routes/logout');
app.set('view engine','ejs');

app.use(express.static('public'));

app.use('/',routes);

app.use('/signup',signup_route);
app.use('/logout',logout_route);
app.use('/add_new_catagory',addnewcatagory_route);
app.use('/password_catagory',viewcatagory_route);
app.use('/add_new_password',addnewpassword_route);
app.use('/view_all_password',viewallpassword_route);
app.use('/password_details',passwordedit_route);


port=process.env.PORT||5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
