const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
const url = process.env.MONGOLAB_URI;
const port = process.env.PORT || 8080;

app.get('/:data', function(req,res){
	var data = req.params.data;

	mongo.connect(url, function(err,db){
		if (err) throw err;

		var collection = db.collection("urls");

		var response = collection.find({
			original_url: data
		})

		console.log(response);
		db.close();
	})
})