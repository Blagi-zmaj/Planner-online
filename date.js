
module.exports.getDate = getDate;

function getDate(){
  const today = new Date();
  let weekDay = today.getDay()+1 ;
  let day = today.getDate() ;
  let month = today.getMonth()+1 ;
  let year = today.getFullYear() ;
  let hour = today.getHours() ;
  let minutes = today.getMinutes() ;
  let seconds = today.getSeconds() ;
  let currentDateAndHour = day + "-" + month + "-" + year + "  " + hour + ":" + minutes + ":" + seconds;
  let currentDate = day + "-" + month + "-" + year;
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
  let currentDateAndHour = day + "-" + month + "-" + year + "  " + hour + ":" + minutes + ":" + seconds;
  let currentDate = day + "-" + month + "-" + year;
  return currentDate;
}
