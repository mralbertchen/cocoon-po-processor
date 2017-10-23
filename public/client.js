var room = 1;

var arrSKU = [];
var arrDesc = [];
var arrPrice = [];

function addRow() {
 
    room++;
    var objTo = document.getElementById('nextline')
    var divtest = document.createElement("div");
    var prevaddbtn = document.getElementById('addRowbtn');
    
  
	  divtest.setAttribute("class", "form-group removeclass"+room);
	  var rdiv = 'removeclass'+room;
    divtest.innerHTML = ' <div class="row"> <div class="col-sm-2 nopadding"> <input type="text" class="form-control SKU" id="SKU' + room + '" list="SKUs" name="Item" value="" placeholder="Item" onchange="skuChange(' + room + ');" required> </div> <div class="col-sm-3 nopadding"> <input type="text" class="form-control Desc" id="Desc' + room + '" name="Desc" value="" placeholder="Description"> </div> <div class="col-sm-2 nopadding"> <input type="number" step="0.01" id="Price' + room + '" class="form-control" name="Price" value="" placeholder="Price" onchange="calcTotal(' + room + ');" required> </div> <div class="col-sm-2 nopadding"> <input type="number" step="0.01" id="Qty' + room + '" class="form-control" name="Qty" value="" placeholder="Qty" onchange="calcTotal(' + room + ');" required> </div> <div class="col-sm-2 nopadding"> <input type="number" step="0.01" class="form-control" id="Total' + room + '" name="Total" value="" placeholder="Total" readonly> </div> <div class="col-sm-1 nopadding"> <div class="input-group-btn" id="addRowbtn"> <button class="btn btn-success btn-block" type="button" onclick="addRow();"> <span class="glyphicon glyphicon-plus" aria-hidden="true">+</span> </button> </div> </div> </div>';
    prevaddbtn.id = 'old';
    var oldroom = room -1
    prevaddbtn.innerHTML = '<button class="btn btn-danger btn-block" type="button" onclick="remove_education_fields(' + oldroom + ');"> <span class="glyphicon glyphicon-minus" aria-hidden="true">-</span> </button>';
    objTo.appendChild(divtest)
}


   function remove_education_fields(rid) {
	   $('.removeclass'+rid).remove();
   }


function skuChange(rowNum) {
  
      var SKU = document.getElementById('SKU' + rowNum);
      
        console.log('sku', SKU.value);

        for (var i = 0; i < arrSKU.length; i++) { 
            if (SKU.value == arrSKU[i]) {
              
              console.log('desc', arrDesc[i]);
              
              var Desc = document.getElementById('Desc' + rowNum);
              Desc.value = arrDesc[i];
              var Price = document.getElementById('Price' + rowNum);
              Price.value = arrPrice[i];
            }
        }
}

function calcTotal(rowNum){
    var Price = document.getElementById('Price' + rowNum);
    var Qty = document.getElementById('Qty' + rowNum);
    var Total = document.getElementById('Total' + rowNum);
  
    var temptotal = Number(Price.value) * Number(Qty.value);

    temptotal = temptotal.toFixed(2); // to 2 s.f.
    Total.value = temptotal;
  
}

jQuery.datetimepicker.setLocale('us');



