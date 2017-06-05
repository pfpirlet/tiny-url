const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
const url = process.env.MONGOLAB_URI;
const port = process.env.PORT || 8080;
var myIndex = 0;

function getMyIndex(){
	mongo.connect(url, function(err,db){
		if (err) throw err;
		var collection = db.collection("urls");
		var myIndex = collection.find().limit(1).sort({$natural:-1}).toArray(function(err, data){
			console.log(data);
			var index = url.lastIndexOf("/");
			var lastIndex = parseInt(data[0]["short_url"].match(/[^\/]+$/));
			console.log("lastIndex: " + lastIndex);
			return lastIndex
		});
		db.close();
	});	
	return myIndex + 1
}

app.get('/new/:data', function(req,res){
	var data = req.params.data;
	var newIndex = getMyIndex();
	res.send("newIndex: " + newIndex);


		//collection.find({original_url: data}).toArray(function(err, results){ //affiche ce qui correspond à data
			//res.send(results);
		//})

		
})

app.listen(port, function () {
  console.log('App listening on port: ' + port)
})