var googleSpreadSheetID="1oiruJ7FAteHaW983UGAK0IpKABwxLcFSDioeDsA";

function testing(){
  var sheet = SpreadsheetApp.openById(googleSpreadSheetID);

sheet=sheet.getSheetByName(Utilities.formatDate(new Date(), "GMT+0530","MMMM yyyy"));
  var data=getAddressesAndCount(sheet,"Arvinth");
Logger.log(  sheet.getRange(data["orderCountCellAddress"],3).getValues().toString());
}


function getAdminNames(sheet,adminCellAddress,){

var adminUsers=[];
 adminUsers=sheet.getRange("C"+adminCellAddress+":"+adminCellAddress).getValues().toString().split(",");
var adminUserList=[];
for(var i=0;i<adminUsers.length;i++){
  if (adminUsers[i].length>2){
adminUserList.push(adminUsers[i]);
  }

}
return adminUserList.toString();
 
}

function getAddressesAndCount(sheet,name){

  var  listOfNames=sheet.getRange("B4:B").getValues().toString().split(",");


  var breakCount=0;
  var onlyNamesCount=-1;
  var adminCellAddress=0;
  var orderCountCellAddress=0;
  var userCellAddress=0;
  var namesList=[];

  for(var i=0;i<=listOfNames.length;i++){

    if(listOfNames[i]==name){
      userCellAddress=i;
    }
   if(breakCount==0){
  onlyNamesCount++
  namesList.push(listOfNames[i]);
  }
  if(breakCount<=1){
    orderCountCellAddress++;
  }if(breakCount<=2){
    adminCellAddress++;
  }

  if (!(listOfNames[i].length>2)&&breakCount==0){
    breakCount++;
  }else 
  if(listOfNames[i]=="Order Count"){
    breakCount++;
  }else if(listOfNames[i]=="Admins"){
//  sheet.getActiveSheet().appendRow(["onlyNamescount: "+onlyNamesCount,"orderCountCellAddress: "+orderCountCellAddress,"admincell adderess"+adminCellAddress]);
    break;
  }

  
 
}

  return {"onlyNamesCount":onlyNamesCount,"orderCountCellAddress":orderCountCellAddress+3,"adminCellAddress":adminCellAddress+3,"userCellAddress":userCellAddress+4, "NamesList":namesList.toString()};



}
function createUpcomingMonth(){

  var sheet = SpreadsheetApp.openById(googleSpreadSheetID);
  var checkingDate=new Date();


  var  ssheet=sheet.getSheetByName(Utilities.formatDate(new Date(checkingDate.getFullYear(),checkingDate.getMonth()-1,checkingDate.getDate()), "GMT+0530","MMMM yyyy"))??sheet.getSheetByName("Lunch Count Tracker");

  if(sheet.getSheetByName(Utilities.formatDate(new Date(), "GMT+0530","MMMM yyyy"))== null){

var data=getAddressesAndCount(ssheet,"");

 newSheet=sheet.insertSheet(0, {template:sheet.getSheetByName(Utilities.formatDate(new Date(checkingDate.getFullYear(),checkingDate.getMonth()-1,checkingDate.getDate()), "GMT+0530","MMMM yyyy"))??sheet.getSheetByName("Lunch Count Tracker")});
 newSheet.setName(Utilities.formatDate(new Date(), "GMT+0530","MMMM yyyy")).getRange("C3:AG"+(data["onlyNamesCount"]+4)).clearContent();
   
   newSheet.getRange("C"+(data["orderCountCellAddress"])+":"+"AG"+(data["orderCountCellAddress"])).clearContent();
 

  newSheet.getRange("C1:J1").setValue("Lunch Count Tracker - "+Utilities.formatDate(new Date(checkingDate.getFullYear(),checkingDate.getMonth(),checkingDate.getDate()), "GMT+0530","MMMM"));



}
return sheet;
}



function doPost(request){
  var checkingDate=new Date();
var writingDate=Utilities.formatDate(new Date(), "GMT+0530", "dd/MM/yyyy");


 var sheet =createUpcomingMonth();

  sheet=sheet.getSheetByName(Utilities.formatDate(new Date(), "GMT+0530","MMMM yyyy"));

  var result = {"status": "SUCCESS"};
  try{

    var name = request.parameter.name;
    var lunchResponse=request.parameter.response;
    var orderCount=request.parameter.orderCount;
    var lastRow = sheet.getDataRange().getLastRow();

var data=getAddressesAndCount(sheet,name);


var currentColumnCount=sheet.getRange("3:3").getValues().toString().split(",");
var finalColCount=0;
for(var i=0;i<=currentColumnCount.length;i++){
  if (!(currentColumnCount[i].length>2)){
    break;
  }
  finalColCount++;
}




var lastColumnValues=sheet.getSheetValues(3,finalColCount,lastRow,1);
var lastEnteredDate=lastColumnValues[0].toString();

var responsedUserRowNumber=data["userCellAddress"];


if((checkingDate.toString().substring(0,15)==lastEnteredDate.substring(0,15))){
  if(lunchResponse!="null"){
 sheet.getRange(responsedUserRowNumber,finalColCount).setValue(lunchResponse);}
 if(orderCount!="null"){
    sheet.getRange(data["orderCountCellAddress"],finalColCount).setValue(orderCount);}
}else{
  sheet.getRange(3,finalColCount+1).setValue(writingDate);
  if(lunchResponse!="null"){
  sheet.getRange(responsedUserRowNumber,finalColCount+1).setValue(lunchResponse);}
   if(orderCount!="null"){
  sheet.getRange(data["orderCountCellAddress"],finalColCount+1).setValue(orderCount);}


}
    
console.log(lastCell);
  }catch(exc){
    result = {"status": "FAILED", "message": exc};
  }


  return JSON.stringify(result);

}

// Get/////////////////////////////////////////////////////

function doGet(request){
  // Open Google Sheet using ID
  var checkingDate=new Date();
var writingDate=Utilities.formatDate(new Date(), "GMT+0530", "dd/MM/yyyy");

 var sheet = createUpcomingMonth();

  sheet=sheet.getSheetByName(Utilities.formatDate(new Date(), "GMT+0530","MMMM yyyy"));

  var result = {"status": "SUCCESS"};

  try{

    var name = request.parameter.name;
    var lastRow = sheet.getDataRange().getLastRow();
    var data=getAddressesAndCount(sheet,name);
    var onlyNames=data["NamesList"];

var currentColumnCount=sheet.getRange("3:3").getValues().toString().split(",");
var finalColCount=0;
for(var i=0;i<=currentColumnCount.length;i++){
  if (!(currentColumnCount[i].length>2)){
    break;
  }
  finalColCount++;
}




var lastColumnValues=sheet.getSheetValues(3,finalColCount,lastRow,1);
var lastEnteredDate=lastColumnValues[0].toString();


var responsedUserRowNumber=data["userCellAddress"];

var adminNames=getAdminNames(sheet,data["adminCellAddress"]);

var password=sheet.getRange(2,2).getValue().toString();


if((checkingDate.toString().substring(0,15)==lastEnteredDate.substring(0,15))){
var orderCount=sheet.getRange(data["orderCountCellAddress"],finalColCount).getValues().toString();
result = {"status": "SUCCESS","lunch":sheet.getRange(responsedUserRowNumber,finalColCount).getValue().toString(),"Names":onlyNames.toString(),"allResponses":sheet.getSheetValues(4,finalColCount,data["onlyNamesCount"],1).toString(),"adminList":adminNames,"orderCount":orderCount,"passcode":password};
}
else{
  sheet.getRange(3,finalColCount+1).setValue(writingDate);
  var orderCount=sheet.getRange(data["orderCountCellAddress"],finalColCount+1).getValues().toString();
  result = {"status": "SUCCESS","lunch":"null","Names":onlyNames.toString(),"allResponses":sheet.getSheetValues(4,finalColCount+1,data["onlyNamesCount"],1).toString(),"adminList":adminNames,"orderCount":orderCount,"passcode":password};

}

  }catch(exc){
    // If error occurs, throw exception
    result = {"status": "FAILED","lunch":"Erorr", "message": exc};
  }
  
  // Return result
  return ContentService
  .createTextOutput(JSON.stringify(result))
  .setMimeType(ContentService.MimeType.JSON);  
}
