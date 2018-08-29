var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var session = require("express-session");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");

var domainRouter = require("./routes/domains");
var certificateRouter = require("./routes/certificates");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/SSLChecker")
  .then(() => console.log("connection succesful"))
  .catch(err => console.error(err));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({extended : false}))
app.use(expressValidator());
app.use(cookieParser());
app.use(session({ secret : 'SonoUnoStronz', saveUninitialized : false, resave : false}))
app.use(express.static(path.join(__dirname, "public")));

app.use("/domains", domainRouter);
// app.use('/certificates', certificateRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
