/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let test_board = 'test'
var ObjectId = require('mongodb').ObjectId;

let test_post;
let test_reply;
let delete_password = 'delete'

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Every field filled in', function(done) {
        chai.request(server)
          .post('/api/threads/' +  test_board)
          .send({
            text: 'This is my test post',
            delete_password: delete_password
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            test_post = new ObjectId(res.redirects[0].substring(res.redirects[0].length -24))
            assert.equal(ObjectId.isValid(res.redirects[0].substring(res.redirects[0].length -24)), true)
            done();
          });
      })
    });
    
    suite('GET', function() {
      test('Generic get request to board', function(done) {
        chai.request(server)
          .get('/api/threads/' +  test_board)
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 10)
            assert.equal(res.body[0].bumped_on > res.body[1].bumped_on, true)
            assert.property(res.body[0], 'replies')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'bumped_on')
            assert.notProperty(res.body[0], 'delete_password')
            assert.notProperty(res.body[0], 'reported')
            done();
          });
      })
      
    });
    
    suite('PUT', function() {
      test('Put request to board', function(done) {
        chai.request(server)
          .put('/api/threads/' +  test_board)
          .send({thread_id: test_post})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success')
            done();
          });
      })
                 
    });
    
    suite('DELETE', function() {
      test('Delete thread board', function(done) {
        chai.request(server)
          .delete('/api/threads/' +  test_board)
          .send({
            thread_id: test_post,
            delete_password: delete_password
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success')
            done();
          });
      })
    });
    
    
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Reply - Every field filled in', function(done) {
        chai.request(server)
          .post('/api/replies/' +  test_board)
          .send({
            thread_id: '5c27c92bd1017f2bb15bb591',
            text: 'This is my test comment',
            delete_password: 'delete'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.redirects[0].substring(res.redirects[0].length -7), '15bb591')
            done();
          });
      })   
    });
    
    suite('GET', function() {
      //5c27c92bd1017f2bb15bb591
      test('One thread every field filled in', function(done) {
        chai.request(server)
          .get('/api/replies/' +  test_board)
          .query({
            thread_id: '5c27c92bd1017f2bb15bb591',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.text, 'This is my test post')
            assert.property(res.body, 'replies')
            test_reply = new ObjectId(res.body.replies[0]._id)
          console.log(test_reply)
            assert.property(res.body, 'created_on')
            assert.property(res.body, 'bumped_on')
            assert.notProperty(res.body, 'delete_password')
            assert.notProperty(res.body, 'reported')
            done();
          });
      })
      
    });
    
    suite('PUT', function() {
      test('Put request to reply', function(done) {
        chai.request(server)
          .put('/api/replies/' +  test_board)
          .send({
            thread_id: new ObjectId('5c27c92bd1017f2bb15bb591'),
            reply_id: test_reply
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success')
            chai.request(server)
              .get('/api/replies/' + test_board)
              .query({
                thread_id: '5c27c92bd1017f2bb15bb591',
              })
              .end(function(error, response){
                assert.equal(response.body.replies[0].reported, true)
              })
            done();
          });
      })
      
    });
    
    suite('DELETE', function() {
      chai.request(server)
        .delete('/api/replies/' +  test_board)
        .send({
          thread_id: new ObjectId('5c27c92bd1017f2bb15bb591'),
          reply_id: test_reply
        })
        .end(function(err, res){
        
      
    });
    
  });

});
