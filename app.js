const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var apiDataPut = "empty";
console.log("apiDataPut: " + apiDataPut);

const tasksSchema = {
  name: String,
  tag: String
};

const Task = mongoose.model("Task", tasksSchema);

const defaultTask1 = new Task({
  name: "Oddanie pracy zaliczeniowej",
  tag: "white"
});

const defaultTask2 = new Task({
  name: "Tagowanie kolorami",
  tag: "white"
});

const defaultTask3 = new Task({
  name: "Wykreślanie zadań",
  tag: "white"
});

const defaultTasks = [defaultTask1, defaultTask2, defaultTask3];

const listSchema = {
  name: String,
  tasks: [tasksSchema]
}

const List = mongoose.model("List", listSchema);

const today = new Date();
const weekDay = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
const days = [];
for(var i=0; i < 31; i++){
  days[i] = i+1;
}
let currentMonth = today.getMonth()+1;
let currentYear = today.getFullYear();

let months = ["Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec", "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"];

let startingMonthDayTab2020 = [3, 6, 7, 3, 5, 1, 3, 6, 2, 4, 7, 2];
let startingMonthDayTab2022 = [6, 2, 2, 5, 7, 3, 5, 1, 4, 6, 2, 4];
let startingMonthDayTab = [5, 1, 1, 4, 6, 2, 4, 7, 3, 5, 1, 3];

let daysMonthAmount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let startingMonthDay = startingMonthDayTab[currentMonth-1];
let startingMonth = months[currentMonth-1];
let startingMonthDaysAmount = daysMonthAmount[currentMonth-1];

let count = 0;
for(var i=1 ; i<10; i++){
  if(i >= startingMonthDay){
    // console.log(i-count);
  } else {
    // console.log(0);
    count++;
  }
}

for(var i=0 ; i<37; i++){
  if(i >= startingMonthDay-1){
    if(i <= startingMonthDaysAmount+startingMonthDay){
      if(i == startingMonthDaysAmount+startingMonthDay-1){
        break;
      } else {

      }
    }
  } else {

  }
}

app.get("/:month/settings/:option", function(req, res){
  const actualMonth = req.params.month;
  const chosenOption = req.params.option;

  if(chosenOption === "previous"){
    if(actualMonth === "Styczen"){
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
  } else {
    if(actualMonth === "Grudzien"){
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
  }

  startingMonthDay = startingMonthDayTab[currentMonth-1];
  let count = 0;
  for(var i=1 ; i<10; i++){
    if(i >= startingMonthDay){
      // console.log(i-count);
    } else {
      // console.log(0);
      count++;
    }
  }

  res.render("calendar", {
    week: weekDay,
    days: days,
    startingMonthDay: startingMonthDayTab[currentMonth-1],
    count: count,
    startingMonthDaysAmount: daysMonthAmount[currentMonth-1],
    startingMonth: months[currentMonth-1],
    currentYear: currentYear,
  });
});

app.get("/test/:listName",function(req, res){
  res.render("test", {});
});

app.get("/calendar", function(req, res){
  res.render("calendar", {
    week: weekDay,
    days: days,
    startingMonthDay: startingMonthDay,
    count: count,
    startingMonthDaysAmount: startingMonthDaysAmount,
    startingMonth: startingMonth,
    currentYear: currentYear
  });
});

var liczenieWywolan = 0;

app.get("/", function(req, res){



  List.find({}, function(err, found){

    console.log(found.length);

    if(found.length === 0){
      const taskListDef = new List({
        name: "DEFAULT",
        tasks: defaultTasks
      });
      const taskListWork = new List({
        name: "work",
        tasks: defaultTasks
      });
      taskListDef.save(function(err, saved){
      });
      taskListWork.save(function(err, saved){
      });

      res.redirect("/lists/default");
    } else {
      res.redirect("/lists/work");
    }
  });

});

var isDefault = false;
var ile = 0;

app.get("/:listToDelete", function(req, res){
  const listToDel = _.lowerFirst(req.params.listToDelete);
  if(!isDefault){
    List.deleteMany({name: "default"}, function(err, deleted){
    });
    isDefault = true;
  }
  res.redirect("/lists/" + listToDel);

});

var actualList = "";

app.get("/create/:listName", function(req, res){
  var asideList = "";

  const custListName = req.params.listName;
  ile++;
  actualList = custListName;
  List.findOne({name: custListName}, function(err, foundList){
    // console.log("foundList: " + foundList);
    if(!err){
      if(!foundList){
        const taskList = new List({
          name: custListName,
          tasks: defaultTasks
        });
          taskList.save(function(err, saved){
            console.log(saved);
          });
          res.redirect("/create/" + custListName);
      } else {
          res.redirect("/lists/" + custListName);
        }
      }
    });
  });

app.get("/api/getList", async function(req, res){
  const lista = await List.findOne({name: "work"});
  return await res.send(lista);
});

app.put("/api/update/", async function(req, res){

  const oldTask = req.query.oldValue;
  const newTask = req.query.value;
  var listName = req.query.title;

  if(listName == "default"){
    listName = "DEFAULT";
    console.log("Nazwa listy zmieniona na DEFAULT");
  }

  List.updateOne({name: listName, 'tasks.name': oldTask}, {$set: {"tasks.$.name": newTask}}, function(err){
    console.log("ZMIENIONO ZADANIE");
  });
});


app.get("/lists/:listName", function(req, res){
  var asideList = "";

  let currentDateAndHour = date.getDate();
  let currentDate = date.getDay();

  const API_KEY = "<yourAPI>";
  const city = "Katowice";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=" + units + "&lang=pl";

  const custListName = req.params.listName;
  if(custListName == "default"){
    actualList = "DEFAULT";
  }
  List.findOne({name: actualList}, function(err, foundList){
    if(!err){
      if(!foundList){
        res.redirect("/create/" + custListName);
      } else {
          https.get(url, function(response){
            response.on("data", function(data){
              const weatherData = JSON.parse(data);
              const weatherDescription = weatherData.weather[0].description;
              const outsideTemperature = weatherData.main.temp;
              const feelTemperature = weatherData.main.feels_like;
              const pressure = weatherData.main.pressure;
              const humidity = weatherData.main.humidity;
              const windSpeed = weatherData.wind.speed;
              const icon = weatherData.weather[0].icon;
              const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
              if((custListName =="default") || (custListName == "DEFAULT")){
                asideList = "DEFAULT";
              }else if((custListName =="__dirname") || (custListName == "favicon.ico")){
                asideList = "DEFAULT";
              } else {
                asideList = "work";
              }

              List.findOne({name: asideList}, function(err, foundWorkList){
                  res.render("index", {
                    icon: imageUrl,
                    weather: _.upperFirst(weatherDescription),
                    outTemp: outsideTemperature,
                    feelTemp: feelTemperature,
                    pressure: pressure,
                    humidity: humidity,
                    windSpeed: windSpeed,

                    currentDateAndHour:currentDateAndHour,
                    currentDate:currentDate,
                    newItemsList: foundList.tasks,
                    title: _.upperFirst(foundList.name),
                    currentYear: currentYear,
                    workListTasks: foundWorkList.tasks
                  });
              });
            })
          });
        }
      }
    });
  });

app.post("/", function(req, res){
  const newTaskName = req.body.newTask;
  var listName = req.body.listButton;

  if(_.isEmpty(newTaskName)){
    if(listName == "default"){
      res.redirect("/lists/default");
    } else {
      res.redirect("/lists/" + listName);
    }
  } else {
    if(listName == "DEFAULT"){
      listName = "DEFAULT";
    }else{
      listName = _.lowerFirst(listName);
    }

    const task = new Task({
      name: newTaskName,
      tag: "white"
    });

    if(listName == "default"){
      List.findOne({name: listName}, function(err, foundList){
        foundList.tasks.push(task);
        foundList.save();
        res.redirect("/lists/default");
      });

    } else {
      List.findOne({name: listName}, function(err, foundList){
        foundList.tasks.push(task);
        foundList.save();
        res.redirect("/lists/" + listName);
      });
    }
  }
});

app.post("/work", function(req, res){
  res.redirect("/lists/work");
});

app.post("/modifyTag", function(req, res){
  const checkedTaskId = req.body.checked;
  var listName = req.body.listName;
  const chosenTagButton = req.body.tagBtn;  //Zwraca kolor przycisku
  const tagTaskId  = req.body.tagChecked;   //Podaje id zadania
  const taskNameToChange = req.body.newTask;

  if(listName == "DEFAULT"){
    listName = "DEFAULT";
  }else{
    listName = _.lowerFirst(listName);
  }

  List.updateOne({name: listName, 'tasks._id': tagTaskId}, {$set: {"tasks.$.tag": chosenTagButton}}, function(err){
    console.log("ZMIENIONO KOLOR");
  });

  List.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: checkedTaskId}}}, function(err, foundList){
      if (!err){
        res.redirect("/lists/" + listName);
      }
  });
});

app.post("/deleteTasks", function(req, res){

  const checkedTaskId = req.body.checked;
  var listName = req.body.listName;
  const chosenTagButton = req.body.tagBtn;  //Zwraca kolor przycisku
  const tagTaskId  = req.body.tagChecked;   //Podaje id zadania
  const taskNameToChange = req.body.newTask;

  if(listName == "DEFAULT"){
    listName = "DEFAULT";
  }else{
    listName = _.lowerFirst(listName);
  }

  List.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: checkedTaskId}}}, function(err, foundList){
      if (!err){
        res.redirect("/lists/" + listName);
      }
  });
});

app.post("/modifyTasks", function(req, res){
  const checkedTaskId = req.body.checked;
  var listName = req.body.listName;
  const chosenTagButton = req.body.tagBtn;  //Zwraca kolor przycisku
  const tagTaskId  = req.body.tagChecked;   //Podaje id zadania
  const taskNameToChange = req.body.newTask;
  const changedTaskName = req.body.submitBTN;

  if(listName == "DEFAULT"){
    listName = "DEFAULT";
  }else{
    listName = _.lowerFirst(listName);
  }

  List.updateOne({name: listName, "tasks._id": tagTaskId}, {$set: {"tasks.$.name": taskNameToChange}}, function(err){
    console.log("ZAKTUALIZOWANO ZADANIE: " + taskNameToChange + " z id: " + tagTaskId);
  });

  res.redirect("/lists/" + listName);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server succesfully running");
});
