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
  arrayDates = retrieveDates();
  console.log(arrayDates);
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
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyuNOFhciDxJE9TG'
});
var base = Airtable.base('appXTjlqPfZHIXrqt');

// var test = base('Aggregate Data').select().all;

console.log('start here')

function retrieveDates(){ 
  // gets a list of dates and returns a variable with an array of all
  
    var arrayDates = [];
    
    var test;
    base('Aggregate Data').select({filterByFormula:"{Date} = '10/6'"
        // Selecting the first 3 records in Grid view:
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            test = record.get('Date');
            console.log('added', test);
            arrayDates.push(test);
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
  
    console.log('test', test);
}

// console.log(test);



