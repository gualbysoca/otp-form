const https = require('https')
var express  = require("express");
var bodyParser = require("body-parser");
const fs = require('fs')
var app = express();

// Get the Javascript in the browser
app.use("/public", express.static("./public"));
// create application/json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteded: true }));
app.set("view engine", "jade");

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(3000, () => {
    console.log('Listening...')
})

app.get("/", function(req, res){
    res.render("index");
});

app.post("/", function(req, res){
    res.render("form", {hola: "Hola Gualby... como estas?"});
});

app.get("/urlbonita/:algo", function(req, res){
    res.render("form", {hola: req.params.algo});
});

app.get("/otp-form1", function(req, res){
    res.render("otp-form1");
});

app.get("/otp-validated", function(req, res){
    res.render("otp-validated");
});

app.post("/otp-form2", function(req, res){
    console.log("El número de teléfono enviado es: "+ req.body.msisdn);
    res.render("otp-form2", {msisdn: req.body.msisdn});
});

app.get("/otp-form", function(req, res){
    res.render("otp-form");
});


app.listen(8080);

