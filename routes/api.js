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
const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  
    .get(function (req, res){

    })

    .post(function (req, res){

    })

    .put(function (req, res){

    })

    .delete(function (req, res){

    })
    
  app.route('/api/replies/:board')
  
    .get(function (req, res){

    })

    .post(function (req, res){

    })

    .put(function (req, res){

    })

    .delete(function (req, res){

    })

};
