// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var arryReq;

var dateToDelete;

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
  
  arryReq = request.body;
  console.log(arryReq);
  
  var people = request.body.People;
  var po_num = request.body.PO_Num;
  
  var dateinq = new Date(request.body.Date);
  console.log(dateinq.getMonth());
  var datestring = dateinq.toISOString();
  dateExists(datestring,function (arrayDates) { // check if the date already exists
     if(arrayDates.length) 
         {  response.sendFile(__dirname + '/views/sure.html'); } else 
           { createRecords(arryReq, function successcallback() {
            
                response.render('success', { returnarray : orgGroup(), returnDate : arryReq.Date });
              });
           }
  
  })
  
  
});


app.post("/overwrite", function (request, response) {
  
  // need to delete record first
    base('Daily Production').select({
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            var deleteID = record.get('Link to Date').pop();
            if (deleteID == dateToDelete) {
                // if this is the ID to be deleted, delete record
                //console.log('Link to Date:', deleteID);
               // console.log('Date to Delete:', dateToDelete);
                base('Daily Production').destroy(record.id, function(err, deletedRecord) {
                    if (err) { console.error(err); return; }
                    console.log('Deleted record', deletedRecord.id);
                });
             }
          
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
      
          base('Aggregate Data').destroy(dateToDelete, function(err, deletedRecord) {
              if (err) { console.error(err); return; }
              console.log('Deleted record', deletedRecord.id);
              createRecords(arryReq, function successcallback() { // now create records
                response.render('success', { returnarray : orgGroup(), returnDate : arryReq.Date });
              });
          });
    });

      
  

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



function createRecords(arrayRecords, callback) {
  
  var dateLink;
  
   base('Aggregate Data').create({
      "Date": arrayRecords.Date,
       "备注": arrayRecords.Notes
    }, function(err, record) {
        if (err) { console.error(err); return; }
        console.log(record.getId());
        dateLink = record.getId();
        console.log('dateLink', dateLink);
     
        var po_num = [];
        var product = [];
        var routing = [];
        var labor = [];
        var produced = [];
        var group = [];
        var people = [];
        var totaltime = [];

        var i = 0;
        var arryGroup = []; // creates an array that holds the name of production groups so people&time are only recorded once
       
        while (arrayRecords.PO_Num[i]) {
            // push array into local variable to be inserted later
            po_num.push(arrayRecords.PO_Num[i]);
            product.push(arrayRecords.Product[i]);
            routing.push(arrayRecords.Routing[i]);
            labor.push(arrayRecords.Labor[i]);
            produced.push(arrayRecords.Produced[i]);
            group.push(arrayRecords.Group[i]);
            
            console.log('indexof: ', arryGroup.indexOf(arrayRecords.Group[i]));
          
            if(arryGroup.indexOf(arrayRecords.Group[i]) >= 0) { // if this group already exists then push blank
                console.log(arrayRecords.Group[i], ' Already exists, skipping ppl/total time');
                people.push('');
                totaltime.push('');  
            } else { // otherwise push what is entered
              console.log(arrayRecords.Group[i], ' doesn\'t exist, adding');
              people.push(arrayRecords.People[i]);
              totaltime.push(arrayRecords.TotalTime[i]);
              arryGroup.push(arrayRecords.Group[i]); // and push the group in so we don't do it again
            }

            i++;
        }
     
        i = 0;

        while (po_num[i]) {
          // now we iterate over the array we created to use Airtable API to create each record
          base('Daily Production').create({
            "Link to Date": [
              dateLink
            ],
            "物料名稱": product[i],
            "工序名稱": routing[i],
            "单位耗时": Number(labor[i]),
            "產量": Number(produced[i]),
            "組别": group[i],
            "当天当组人数": Number(people[i]),
            "当天当组总工时": Number(totaltime[i]),
            "订单": po_num[i]
          }, function(err, record) {
              if (err) { console.error(err); return; }
              console.log(record.getId());
          });

          i++;
        }

        callback();
    });
  

  
  
}


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
        dateToDelete = record.id;
          
          console.log('dateToDelete:', dateToDelete);
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
  
function orgGroup(){
  // function for organizing the form data by their group
  var groupArray = [];
  var groupList = [];
  var i = 0;
  var arryIndex = 0; // index for Group array
  
  
  while (arryReq.Group[i]) {
    if(groupList.indexOf(arryReq.Group[i])<0) {
      // if this group hasn't been recorded yet
      groupList.push(arryReq.Group[i]); // record it
   //   console.log('groupList',groupList);
      var thisIndex = groupArray.push({'Group':arryReq.Group[i], 'People':arryReq.People[i], 'TotalTime' : arryReq.TotalTime[i],
                        'PO_Num' : [],
                        'Product' : [],
                        'Routing' : [],
                         'Labor' : [],
                       'Produced' : []
                      
                      }); // push info into the array
      
    }
    arryIndex = groupList.indexOf(arryReq.Group[i]); // get index of the group in the array
    groupArray[arryIndex].PO_Num.push(arryReq.PO_Num[i]);
    groupArray[arryIndex].Product.push(arryReq.Product[i]);
    groupArray[arryIndex].Routing.push(arryReq.Routing[i]);
    groupArray[arryIndex].Labor.push(arryReq.Labor[i]);
    groupArray[arryIndex].Produced.push(arryReq.Produced[i]);

    
   // console.log('groupArray',groupArray);
    // add data into it
    
    i++;
  }
  
  console.log('Group Array', groupArray);
  return groupArray;
}



