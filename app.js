var express = require('express')
var bodyparser=require('body-parser')
var mongoose=require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

var app=express()
app.use(express.static('public'))
app.use(bodyparser.urlencoded({
    extended:true
}))
var userdetails=require('./server/routes/user-routes.js')
var blogdetails=require('./server/routes/blog-routes.js')

//Connection to the Database
mongoose.connect('mongodb://localhost:27017/Exercise',{
    useNewUrlParser:true,
    useUnifiedTopology:true 
});

var db=mongoose.connection;

db.on('error',()=> console.log('Error occured'))
db.once('open',()=>console.log('Connected successfully to MongoDB!'))

app.use(bodyparser.json())
// log requests
app.use(morgan('tiny'));

app.use('/user',userdetails)
app.use('/blog',blogdetails)

// Set EJS as the view engine
app.set('view engine', 'ejs');

//app.use(methodOverride('_method'));

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// Assuming you're using Express.js
app.get('/add_blog/:id', (req, res) => {
    const id = req.params.id;
    // console.log('print',id);
    res.render('add_user',{id});
});


app.get('/update-blog/:id', (req, res) => {
    const id = req.params.id;
    res.render('update_user',{id});
});



app.get('/login.html', (req, res) => {
    res.redirect('login.html');
});
app.get('/relogin', (req, res) => {
    res.redirect('login.html');
});

app.get('/signout', (req, res) => {
    res.redirect('http://localhost:3000');
});
 

// load routers
//app.use('/', require('./server/routes/router'))

app.listen(3000,(err)=>
{
console.log("Successfully started Node.js")  
})