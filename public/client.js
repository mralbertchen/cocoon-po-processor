var room = 1;

var arrSKU = [];
var arrDesc = [];

function addRow() {
 
    room++;
    var objTo = document.getElementById('nextline')
    var divtest = document.createElement("div");
    var prevaddbtn = document.getElementById('addRowbtn');
    
  
	  divtest.setAttribute("class", "form-group removeclass"+room);
	  var rdiv = 'removeclass'+room;
    divtest.innerHTML = ' <div class="row"> <div class="col-sm-2 nopadding"> <input type="text" onchange="skuChange(' + room + ');" class="form-control SKU" id="SKU' + room + '" list="SKUs" name="Item" value="" placeholder="Item" required> </div> <div class="col-sm-3 nopadding"> <input type="text" id="Desc' + room + '" class="form-control Desc" name="Desc" value="" placeholder="Description" required> </div> <div class="col-sm-2 nopadding"> <input type="text" class="form-control" name="Price" value="" placeholder="Price" required> </div> <div class="col-sm-2 nopadding"> <input type="number" class="form-control" name="Qty" value="" placeholder="Qty" required> </div> <div class="col-sm-2 nopadding"> <input type="number" class="form-control" name="Total" value="" placeholder="Total" required> </div> <div class="col-sm-1 nopadding"> <div class="input-group-btn" id="addRowbtn"> <button class="btn btn-success btn-block" type="button" onclick="addRow();"> <span class="glyphicon glyphicon-plus" aria-hidden="true">+</span> </button> </div> </div> </div>';
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
            }
        }
}

jQuery.datetimepicker.setLocale('us');



