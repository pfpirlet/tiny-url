const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const validUrl = require("valid-url");
const url = process.env.MONGOLAB_URI;
const port = process.env.PORT || 8080;
var myIndex = 0;

mongoose.connect(url);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
var urlSchema = new mongoose.Schema({
  myIndex: Number,
  original_url: String,
  short_url: String
});
var urlModel = db.model("urls", urlSchema);

app.get("/new/:href(*)", function(req, res) {
  var data = req.params.href;
  var index = 0;

  if (validUrl.isHttpUri(data) || validUrl.isHttpsUri(data)) {
    urlModel.count({}, function(err, count) {
      var index = count;
      console.log("index: " + index);
      var newEntry = new urlModel({
        myIndex: index,
        original_url: data,
        short_url: "https://tiny-url-pfp.herokuapp.com/" + index
      });
      newEntry.save(function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("New entry added. Data :" + data);
          var response = {
            original_url: data["original_url"],
            short_url: data["short_url"]
          };
          res.json(response);
        }
      });
    });
  } else {
    res.send("Not a valid URL. (Forgot the 'http://' part?)");
  }
});

app.get("/:data", function(req, res) {
  var data = req.params.data;
  if (data != "favicon.ico") {
    console.log("DATA: " + data);
    urlModel.findOne({ myIndex: data }, "original_url", function(err, url) {
      if (url === null) {
        res.json("Please use an existing short url.");
      } else if (err) {
        console.log(err);
      } else {
        res.redirect(url.original_url);
      }
    });
  }
});

app.listen(port, function() {
  console.log("App listening on port: " + port);
});
