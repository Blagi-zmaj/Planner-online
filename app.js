const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

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
  name: "<--Wykreślanie zadań"
});

const defaultTasks = [defaultTask1, defaultTask2, defaultTask3];

// Tworzymy schemat listy dla templatki
const listSchema = {
  name: String,
  tasks: [tasksSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/:listName", function(req, res){

  let currentDateAndHour = date.getDate();
  let currentDate = date.getDay();

  const API_KEY = "34538dd7e7b8dca98778592aa134911e";
  const city = "Katowice";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=" + units + "&lang=pl";

  const custListName = req.params.listName;

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

app.get("/calendar", function(req, res){
  res.sendFile(__dirname + "/calendar.html");
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


app.post("/deleteTasks", function(req, res){
  const checkedTaskId = req.body.checked;
  const listName = req.body.listName;

  List.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: checkedTaskId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
});

app.listen(3000, function(){
  console.log("Server listen on port 3000");
});
