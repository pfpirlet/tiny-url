const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const url = process.env.MONGOLAB_URI;
const port = process.env.PORT || 8080;
var myIndex = 0;

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var urlSchema = new mongoose.Schema({original_url:String,short_url:String});
var urlModel = db.model('urls', urlSchema);

app.get('/new/:data', function(req,res){
	var data = req.params.data;
	var index = 0;

	urlModel.count({}, function(err , count){
  		var index = count;
 		console.log("index: " + index);
 		var newEntry = new urlModel({ original_url: data, short_url: "https://tiny-url-pfp.herokuapp.com/" + index});
		newEntry.save(function (err, data) {
  			if (err) {
    			console.log(err);
  			} else {
    			console.log("New entry added. Data :" + data);
    			res.send(data["short_url"]);
  			}
		});
	});
});

app.listen(port, function () {
  console.log('App listening on port: ' + port)
})