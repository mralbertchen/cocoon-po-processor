// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

//To parse json data
app.use(bodyParser.json());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/submit", function (request, response) {
  console.log(request.body);
  var people = request.body.People;
  var po_num = request.body.PO_Num;
  
  var i = 0;
  
  while (people[i]) {
    console.log(people[i] + " " + po_num[i]);
    i++;
  }

  response.sendStatus(200);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyuNOFhciDxJE9TG'}).base('appbHHEyKaW3JuZd6');


var test = base('Daily Production').find('recnhAkZx4IuHS4WY', function(err, record) {
    if (err) { console.error(err); return; }
    
});

console.log(test);



