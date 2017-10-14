var room = 1;
function addRow() {
 
    room++;
    var objTo = document.getElementById('nextline')
    var divtest = document.createElement("div");
    var prevaddbtn = document.getElementById('addRowbtn');
    
  
	  divtest.setAttribute("class", "form-group removeclass"+room);
	  var rdiv = 'removeclass'+room;
    divtest.innerHTML = ' <div class="row"> <div class="col-sm-2 nopadding"> <input type="text" class="form-control" name="PO_Num" value="" placeholder="PO订单号" required> <div class="invalid-feedback"> 不可空白 </div> </div> <div class="col-sm-1 nopadding"> <input type="text" class="form-control" name="Product" value="" placeholder="产品" required> <div class="invalid-feedback"> 不可空白 </div> </div> <div class="col-sm-2 nopadding"> <input type="text" class="form-control" name="Routing" value="" placeholder="工序" required> <div class="invalid-feedback"> 不可空白 </div> </div> <div class="col-sm-1 nopadding"> <input type="number" class="form-control" ame="Labor" value="" placeholder="单位耗时" required> <div class="invalid-feedback"> 必填数字 </div> </div> <div class="col-sm-1 nopadding"> <input type="number" class="form-control" name="Produced" value="" placeholder="产量" required> <div class="invalid-feedback"> 必填数字 </div> </div> <div class="col-sm-2 nopadding"> <input type="text" class="form-control" name="Group" value="" placeholder="组别" required> <div class="invalid-feedback"> 不可空白 </div> </div> <div class="col-sm-1 nopadding"> <input type="number" class="form-control" name="People" value="" placeholder="当日此组人数" required> <div class="invalid-feedback"> 必填数字 </div> </div> <div class="col-sm-1 nopadding"> <input type="number" class="form-control" name="TotalTime" value="" placeholder="当日此组总工时" required> <div class="invalid-feedback"> 必填数字 </div> </div> <div class="col-sm-1 nopadding"> <div class="input-group-btn" id="addRowbtn"> <button class="btn btn-success btn-block" type="button" onclick="addRow();"> <span class="glyphicon glyphicon-plus" aria-hidden="true">+</span> </button> </div> </div> </div>';
    prevaddbtn.id = 'old';
    var oldroom = room -1
    prevaddbtn.innerHTML = '<button class="btn btn-danger btn-block" type="button" onclick="remove_education_fields(' + oldroom + ');"> <span class="glyphicon glyphicon-minus" aria-hidden="true">-</span> </button>';
    objTo.appendChild(divtest)
}
   function remove_education_fields(rid) {
	   $('.removeclass'+rid).remove();
   }

jQuery.datetimepicker.setLocale('ch');