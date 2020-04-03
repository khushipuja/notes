const express = require('express');

const app = express();
const port = 8000;
const db = require('./config/mongoose');
const User = require('./models/user');
const Post=require('./models/posts');
const passport = require('passport');
const session = require('express-session');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);

app.use(express.static('./assets'));
app.use(express.urlencoded());

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'

        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/',function(req,res){
   return res.render('login');
});


    
// app.get('/create-post',function(req,res){

//     return res.render('create-posts');
// });
app.get('/profile',function(req,res){

    return res.render('profile');
});
app.get('/sign-up',function(req,res){

    return res.render('sign-up');
});
app.post('/create',function(req,res){
    
    console.log(req.body);
        if (req.body.password != req.body.confirm_password){
            // req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }
    
        User.findOne({email: req.body.email}, function(err, user){
            if(err){
                // req.flash('error', err); 
                console.log('error');
                return}
    
            if (!user){
                User.create({email:req.body.email,password:req.body.password,name:req.body.name}, function(err, user){
                    if(err){
                         return}
    
                    return res.redirect('/');
                });
            }else{
                // req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('back');
            }
    
        });
    
    
});

app.post('/create-post',function(req,res){
console.log(req.body);
Post.create({content:req.body.description,user:req.user._id},function(err,post){
    if(err)
    {
        console.log(err);
        return res.redirect('/home');
    }
    
    return res.redirect('/findposts');
});

  
});
app.get('/findposts',function(req,res){
    console.log('find');
    Post.find({user:req.user.id},function(err,posts){
        if(err)
        {
            // console.log(err);
            console.log('kp');
            return res.redirect('/home');
        }
        
        return res.render('profile',{posts:posts});
        
          });
});


app.get('/delete-post/:id',function(req,res){
Post.findByIdAndDelete(req.params.id,function(err){
    if(err)
    {
        console.log(err);
        
    }
    return res.redirect('back');
});

});
app.get('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/'},
), function(req,res){
    console.log('here');
    return res.redirect('/home')
});
app.get('/home',function(req,res){
return res.render('create-posts');
});
app.post('/update/:id',function(req,res){

    console.log('GOING TO UPDAE');
    console.log(req.body);
    Post.findByIdAndUpdate(req.params.id,{content:req.body.content,user:req.user._id},function(err,post){
if(err)
{
    console.log(err);
    return res.redirect('back');
}
console.log('post update*********');
res.redirect('/findposts');

    });

});
app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});

