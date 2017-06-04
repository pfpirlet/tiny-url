const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
const url = process.env.MONGOLAB_URI;
const port = process.env.PORT || 8080;

app.get('/new/:data', function(req,res){
	var data = req.params.data;

	mongo.connect(url, function(err,db){
		if (err) throw err;

		var collection = db.collection("urls");

		var lastURL = collection.find().limit(1).sort({$natural:-1}).toArray(); // réponse asynchrone -> Console.log la lit trop vite.

		console.log(lastURL);

		collection.find({original_url: data}).toArray(function(err, results){ //affiche ce qui correspond à data
			res.send(results);
		})

		db.close();
	});
})

app.listen(port, function () {
  console.log('App listening on port: ' + port)
})