/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const CONNECTION_STRING = process.env.DB;
let db;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  
    .get(function (req, res){
    
      let board = req.params.board
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(board);
        let projection = {
          delete_password: false,
          reported: false
        }
        collection.find({}, {limit: 10, fields: projection, sort: {bumped_on:1}}).toArray((err,data) =>{
          console.log(err, data)
          data.forEach((record) => {
            record.replies = record.replies.slice(0,3)
          })
          res.json(data)
        })
      })

    })

    .post(function (req, res){
      let board = req.params.board
      let post = {
          text: req.body.text,
          delete_password: req.body.delete_password,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          replies: []
        };
      if(!post.text || !post.delete_password) {
          res.send('missing inputs');
        } else{
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
            let collection = db.collection(board);
            collection.insertOne(post, (err, data) =>{
              post._id = data.insertedId;
              res.redirect('/b/' + board)
            })
          })
        }

      })

    .put(function (req, res){

    })

    .delete(function (req, res){

    })
    
  app.route('/api/replies/:board')
  
    .get(function (req, res){

    })

    .post(function (req, res){
    //Sort the array by date on write in

    })

    .put(function (req, res){

    })

    .delete(function (req, res){

    })

};
