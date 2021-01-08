const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static("public"));
mongoose.connect("mongodb+srv://admin-Daniel:Wombat1990@todolist.uwuf9.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});



const tasksSchema = {
  name: String
};

const Task = mongoose.model("Task", tasksSchema);

const defaultTask1 = new Task({
  name: "Oddanie pracy zaliczeniowej"
});

const defaultTask2 = new Task({
  name: "<-- Tagowanie kolorami"
});

const defaultTask3 = new Task({
  name: "<-Wykreślanie zadań"
});

const defaultTasks = [defaultTask1, defaultTask2, defaultTask3];

// Tworzymy schemat listy dla templatki
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

let months = ["Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec", "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"];
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

console.log(startingMonthDay-1);
console.log(startingMonthDaysAmount);
for(var i=0 ; i<37; i++){
  if(i >= startingMonthDay-1){
    if(i <= startingMonthDaysAmount+startingMonthDay){
      if(i == startingMonthDaysAmount+startingMonthDay-1){
        break;
      } else {
        // console.log( i - count + 1 );
      }
    }
  } else {
    // console.log(" 0 ");
  }
}


app.get("/:month/settings/:option", function(req, res){
  const actualMonth = req.params.month;
  const chosenOption = req.params.option;

  if(chosenOption === "previous"){
    if(actualMonth === "Styczen"){
      currentMonth = 12;
    } else {
      currentMonth--;
    }
  } else {
    if(actualMonth === "Grudzien"){
      currentMonth = 1;
    } else {
      currentMonth++;
    }
  }

  startingMonth = months[currentMonth];
  res.render("calendar", {
    week: weekDay,
    days: days,
    startingMonthDay: startingMonthDay,
    count: count,
    startingMonthDaysAmount: startingMonthDaysAmount,
    startingMonth: months[currentMonth-1]
  });
});

app.get("/test/:listName",function(req, res){
  res.render("test", {});
});

app.get("/calendar", function(req, res){
  // res.sendFile(__dirname + "/calendar.html");
  res.render("calendar", {
    week: weekDay,
    days: days,
    startingMonthDay: startingMonthDay,
    count: count,
    startingMonthDaysAmount: startingMonthDaysAmount,
    startingMonth: startingMonth
  });
});

// app.get("/test/:listName",function(req, res){
//   res.render("test");
// });

app.get("/:listName", function(req, res){

  let currentDateAndHour = date.getDate();
  let currentDate = date.getDay();

  const API_KEY = "34538dd7e7b8dca98778592aa134911e";
  const city = "Katowice";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=" + units + "&lang=pl";

  const custListName = req.params.listName;

  // if(custListName === "calendar"){
  //   res.redirect("/calendar");
  // }

  List.findOne({name: custListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const taskList = new List({
          name: custListName,
          tasks: defaultTasks
        });

        taskList.save();
        res.redirect("/" + custListName);

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
            res.render("index", {
              icon: imageUrl,
              weather: weatherDescription,
              outTemp: outsideTemperature,
              feelTemp: feelTemperature,
              pressure: pressure,
              humidity: humidity,
              windSpeed: windSpeed,
              currentDateAndHour:currentDateAndHour,
              currentDate:currentDate,
              newItemsList: foundList.tasks,
              title: foundList.name
            });
          })
        });
      }
    }
  });
});



app.post("/", function(req, res){
  // const newItem = req.body.newTask;
  const newTaskName = req.body.newTask;
  const listName = req.body.listButton;
  console.log("Nazwa listy " + listName);

  const task = new Task({
    name: newTaskName
  });

    List.findOne({name: listName}, function(err, foundList){
      console.log("FOUNDLIST: " + foundList);
      console.log("FOUNDLIST.TASKS: " + foundList.tasks);
      foundList.tasks.push(task);
      foundList.save();
      res.redirect("/" + listName);
    });
  });

app.post("/work", function(req, res){
  res.redirect("/work");
});

app.post("/deleteTasks", function(req, res){
  const checkedTaskId = req.body.checked;
  const listName = req.body.listName;

  List.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: checkedTaskId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server succesfully running");
});
