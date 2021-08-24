
module.exports.getDate = getDate;

function getDate(){
  const today = new Date();
  let weekDay = today.getDay()+1 ;
  let day = today.getDate();
  let month = today.getMonth()+1 ;
  let year = today.getFullYear() ;
  let hour = today.getHours() ;
  let minutes = today.getMinutes();
  let seconds = today.getSeconds() ;
  let dataTab = [day, month, year, hour, minutes, seconds];
  for(var i=0 ; i < dataTab.length; i++){
    if(dataTab[i] < 10){
      dataTab[i] = "0" + dataTab[i];
    }
  }
  let currentDateAndHour = dataTab[0] + "-" + dataTab[1] + "-" + dataTab[2] + "  " + dataTab[3] + ":" + dataTab[4] + ":" + dataTab[5];
  return currentDateAndHour;
}

module.exports.getDay = getDay;

function getDay(){
  const today = new Date();
  let weekDay = today.getDay()+1 ;
  let day = today.getDate() ;
  let month = today.getMonth()+1 ;
  let year = today.getFullYear() ;
  let hour = today.getHours() ;
  let minutes = today.getMinutes() ;
  let seconds = today.getSeconds() ;
  let dataTab = [day, month, year, hour, minutes, seconds];
  for(var i=0 ; i < dataTab.length; i++){
    if(dataTab[i] < 10){
      dataTab[i] = "0" + dataTab[i];
    }
  }
  let currentDate = dataTab[0] + "-" + dataTab[1] + "-" + dataTab[2];
  return currentDate;
}
