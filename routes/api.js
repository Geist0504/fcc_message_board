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
          data.forEach((record) => {
            record.replies = record.replies.slice(0,2)
            
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
              res.redirect('/b/' + board + '/' + data.insertedId)
            })
          })
        }

      })

    .put(function (req, res){

    })

    .delete(function (req, res){
    let board = req.params.board
    let thread_id = req.body.thread_id
    let delete_password = req.body.delete_password
    if(!thread_id || !delete_password || !ObjectId.isValid(thread_id)) {
          res.send('missing inputs or invalid Id');
        } else{
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
            let collection = db.collection(board);
            let query = {
              _id: new ObjectId(thread_id),
              delete_password: delete_password
            }
            collection.findOneAndDelete(query, (err, data) =>{
              data.value ? res.send('success') : res.send('incorrect password')
            })
          })
        }

    })
    
  app.route('/api/replies/:board')
  
    .get(function (req, res){
      let board = req.params.board
      let thread_id = req.query.thread_id
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(board);
        let projection = {
          delete_password: false,
          reported: false
        }
        collection.findOne({_id: new ObjectId(thread_id)}, {fields: projection}, (err,data) =>{
          res.json(data)
        })
      })

    })

    .post(function (req, res){
    //Sort the array by date on write in
      let board = req.params.board
      let thread_id = req.body.thread_id
      let reply = {
          _id: new ObjectId(),
          text: req.body.text,
          delete_password: req.body.delete_password,
          created_on: new Date(),
          reported: false
        };
        if(!reply.text || !reply.delete_password) {
          res.send('missing inputs');
        } else{
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
            let collection = db.collection(board);
            collection.findOneAndUpdate({_id:new ObjectId(thread_id)}, {$push: {replies: {$each:[reply], $position:0}}, $set:{bumped_on:reply.created_on}}, {returnOriginal: false}, (err, data) =>{
              res.redirect('/b/'+board+'/'+thread_id)
            })
          })
        }
    
    })

    .put(function (req, res){

    })

    .delete(function (req, res){
    let board = req.params.board

    })

};
