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

app.set('view engine', 'pug');

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  
  response.sendFile(__dirname + '/views/index.html');
});


// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/submit", function (request, response) {
  console.log(request.body);
  var people = request.body.People;
  var po_num = request.body.PO_Num;
  
  var dateinq = new Date(request.body.Date);
  console.log(dateinq.getMonth());
  var datestring = dateinq.toISOString();
  dateExists(datestring,function (arrayDates) { // check if the date already exists
     if(arrayDates.length) {  response.render('sure', { title: 'Hey', message: 'Hello there!' });} else { console.log('no date!');}
  
  })
  
  
  // this is where we iterate through the array data and record the data
  var i = 0;
  
  while (people[i]) {
    console.log(people[i] + " " + po_num[i]);
    i++;
  }

//  response.sendStatus(200);
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



function dateExists(thisDate, callback){

    console.log('start here')

    var arrayDates = [];


    var allrecords = base('Aggregate Data').select({filterByFormula: "{Date}='" + thisDate + "'"
        // Selecting date
    });

    function pageFunc(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.


        records.forEach(function(record) {
        arrayDates.push((record.fields.Date));
          // console.log(arrayDates);
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }



    allrecords.eachPage(pageFunc, function done(err) {

        callback(arrayDates);
        if (err) { console.error(err); return; }
    });

}
  




