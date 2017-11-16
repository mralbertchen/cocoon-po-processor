// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var dateToDelete;


//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

//To parse json data
app.use(bodyParser.json());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.set('view engine', 'ejs');

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  
  getClients(function(clientList) { 
      getSKUs(function(SKUList) { 
        response.render('main', { clients : clientList, SKUs : SKUList });
      });
      
  });
  
  
});


app.get("/test", function (request, response) {
  
// this is just for testing
    deletePO('008',function() {
      
        response.sendStatus(200);
    });
    
  
  
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/submit", function (request, response) {
  
  
  console.log(request.body);
  console.log('array?',request.body.Item.constructor === Array);

  
  var arrReq = request.body;
  
  
  POExists(request.body.PO_Num, function (POid) { // check if PO exists
      if(POid) { // if exists
        response.render('overwrite', {  arrReq: arrReq } ); // ask if overwrite, send request array back to template 
      } else {
        // if not, check if client exists and create PO with the ID returned via callback
        clientExists(arrReq.client, arrReq.BillTo, function (clientID) {
            createPO(arrReq, clientID, function () {
              response.render('success', { arrReq: arrReq }); // render success with the requested array
            }); 
             
        });
        
        
      }
      
    }
  )
  
  
  
});


app.post("/overwrite", function (request, response) {

  var reqBody = JSON.parse(request.body.values);
  console.log(reqBody);
  
  // delete existing PO
  
  deletePO(reqBody.PO_Num, function() {
    
      // after deletion just recreate
        // check if client exists and create PO with the ID returned via callback
      clientExists(reqBody.client, reqBody.BillTo, function (clientID) {
          createPO(reqBody, clientID, function () {
            response.render('success', { arrReq: reqBody }); // render success with the requested array
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
    apiKey: process.env.AIRTABLE_API
});
var base = Airtable.base('appQEfsiAExP1LPPn'); // cocoon order sandbox




function getClients(callback) {
  
    var arrReturn = [];
    base('Clients').select({
        // Selecting the first 3 records in Grid view:
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
          //  console.log('Retrieved', record.get('Name'));
          arrReturn.push(record);
          
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

      }, function done(err) {
          
          if (err) { console.error(err); return; }
        
          callback(arrReturn);
      });
}

function getSKUs(callback) {
  
    var arrReturn = [];
    base('SKUs').select({
        // Selecting the first 3 records in Grid view:
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
          //  console.log('Retrieved', record.get('Name'));
          arrReturn.push(record);
          
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

      }, function done(err) {
          
          if (err) { console.error(err); return; }
        
          callback(arrReturn);
      });
}




function POExists(PO_Num, callback) {
  
  // Parameter: PO Number to check
  // Callback: UID of the PO Number
  
    var returnThis;
  
    base('PO List').select({
        // Selecting the first 3 records in Developer View:
        filterByFormula : "{PO Number} ='" + PO_Num + "'"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Found', record.get('PO Number'));
            returnThis = record.id;
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        callback(returnThis);
    });
  
}

function clientExists(clientName, billTo, callback) { 
  // Parameter: Client Name
  // Callback: UID of the client ID or newly created ID
  
      var returnThis;
  
    base('Clients').select({
        // Selecting the first 3 records in Developer View:
        filterByFormula : "{Name} ='" + clientName + "'"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Found', record.get('Name'));
            returnThis = record.id;
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        if (returnThis) { callback(returnThis); } else {
            // if not found, create it
            base('Clients').create({
              "Name": clientName,
              "Company Details": billTo
            }, function(err, record) {
                if (err) { console.error(err); return; }
                console.log('Created Client', record.id);
                callback(record.id); // callback with the new id
            });

        }
          
          
        
    });
  
}


function SKUExists(arrReq, i, callback) { 
  // Parameter: Request Body Object Array, i = current iteration
  // Callback: UID of the SKU found, or the UID of new SKU created
  
      var returnThis;
  
    base('SKUs').select({
        // Selecting the first 3 records in Developer View:
        filterByFormula : "{SKU} ='" + arrReq.Item[i] + "'"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Found', record.get('SKU'));
            returnThis = record.id;
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        if (returnThis) { // if found, return ID
          callback(returnThis); // callback with found ID
        } else {
            // if not found, create it
            let thisPrice = Number(arrReq.Price[i]);
            base('SKUs').create({
              "SKU": arrReq.Item[i],
              "Desc": arrReq.Desc[i],
              "Default Sale Price": thisPrice
            }, function(err, record) {
                if (err) { console.error(err); return; }
                console.log('Created SKU', record.id);
                callback(record.id); // callback with the new id
            });

        }
    });
  
}

function createPO(arrReq, clientID, callback) {
  // Parameter: Request Object Body, UID of Client
  // Callback: Success or error
  
    var reqBod = {}; // this will be the final request object body for iterating
  
    base('PO List').create({
      "PO Number": arrReq.PO_Num,
      "PO Date": arrReq.Date,
      "Client": [
        clientID
      ]
    }, function(err, record) {
        if (err) { console.error(err); return; }
      
        
        var tempReq = { // create a temporary request array
            "Item" : [], 
            "Price" : [],
            "Desc" : [],
            "Qty" : []
        };
      
        // after created, use this to create items in PO Items list
        // check if there's only one item, if yes, push it into new array, otherwise proceed as normal
        if(arrReq.Item.constructor === Array) {
          // if arr Req contains more than one item then reqBod will just use arrReq
          
          reqBod = arrReq;
          console.log('reqBod', reqBod);
          
        } else {
          
            tempReq.Item.push(arrReq.Item);
            tempReq.Price.push(arrReq.Price);
            tempReq.Desc.push(arrReq.Desc);
            tempReq.Qty.push(arrReq.Qty);
            
            reqBod = tempReq; // if not then it will push the item into the array (to avoid iterating over the string instead)
              
        }
        
        var i = 0;
        var loopArray = function (reqBod) { // create asynchronous loop
            let thisPrice = Number(reqBod.Price[i]);
            let thisQty = Number(reqBod.Qty[i]);
          
            console.log("Price and Qty:", thisPrice, thisQty);
          
            // Does this SKU exist?
            SKUExists(reqBod, i,  function(SKUID) {
                base('PO Items').create({
                  "SKU#": [
                    SKUID
                  ],
                  "Unit Price": thisPrice,
                  "Total Units": thisQty,
                  "PO #": [
                    record.id
                  ]
                }, function(err, record) {
                    if (err) { console.error(err); return; }
                    console.log('Created record', record.id, record.fields["Unit Price"], record.fields["Total Units"]);
                    console.log("iteration:", i);
                    i++;
                    if(i<reqBod.Item.length) { 
                      loopArray(reqBod);  // if more items to loop
                    } else { 
                      callback();  // call back if loop done
                    }
                });                  
            });
          
            
        }
        
        loopArray(reqBod); // start loop
        
        
        
    });

}

function deletePO (PO_Num, callback) {
  
    var deleteID;
  // find the PO id first
    base('PO List').select({
        // Selecting the first 3 records in Developer View:
        filterByFormula : "{PO Number} ='" + PO_Num + "'"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            deleteID = record.id;
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        // now that's found, use it to delete stuff
      
            base('PO Items').select({
              }).eachPage(function page(records, fetchNextPage) {
                  // This function (`page`) will get called for each page of records.

                  records.forEach(function(record) {
                      var thisID = record.get('PO #');
                     // console.log('thisID', thisID);
                      if (thisID == deleteID) {
                          // if this is the ID to be deleted, delete record

                          base('PO Items').destroy(record.id, function(err, deletedRecord) {
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

                    base('PO List').destroy(deleteID, function(err, deletedRecord) {
                        if (err) { console.error(err); return; }
                        console.log('Deleted record', deletedRecord.id);
                        callback();
                    });
              });      
      
      
      
      
      
    });


}