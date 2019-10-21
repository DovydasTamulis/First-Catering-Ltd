var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbr = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys');

// Connect to MongoDB
mongoose
  .connect('mongodb://admin:'+ 'admin' +'@ecardcluster-shard-00-00-nkjuw.mongodb.net:27017,ecardcluster-shard-00-01-nkjuw.mongodb.net:27017,ecardcluster-shard-00-02-nkjuw.mongodb.net:27017/test?ssl=true&replicaSet=ECardCluster-shard-0&authSource=admin&retryWrites=true')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


  var routes = require('./routes/index');
  var users = require('./routes/users');
  var products = require('./routes/products');
  var topups = require('./routes/topups');


  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  

  //View Engine
  app.set('views', path.join(__dirname, 'views'));
  // app.set('view engine', 'jade');
  app.engine('handlebars', exphbr({defaultLayout: 'layout'}));
  app.set('view engine', 'handlebars');
  
  //BodyParser Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  
  //Set static folder
  app.use(express.static(path.join(__dirname, 'public')));
  
  //Express Session
  app.use(session({
      secret : 'secret',
      saveUninitialized: true,
      resave: true
  }));
  
  //Express validator
  app.use(expressValidator({
      errorFormatter: function(param,msg,value){
          var namespace = param.split('.'),
          root = namespace.shift(),
          formParam= root;
          while(namespace.length){
              formParam += '[' + namespace.shift() + ']';
          }
          return{
              param: formParam,
              msg : msg,
              value: value
          };
      }
  }));
  
  //Connet Flash
  app.use(flash());






  
  //Global vars
  app.use(function(req,res,next){
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      // res.locals.user_loggedIn = req.flash('user_loggedIn');
    //   res.locals.user = req.user || null ;
      next();
  });
  
//use images

app.use(express.static('public'));
app.use(express.static('img')); 
app.use('/static', express.static('public'))



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/products', require('./routes/products.js'));

app.use('/topups', require('./routes/topups.js'));



const PORT = process.env.PORT || 3000;
// const SecondTerminal = process.env.PORT1 || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

// app.listen(SecondTerminal, console.log(`Server started on port ${SecondTerminal}`));
