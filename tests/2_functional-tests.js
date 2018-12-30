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

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Every field filled in', function(done) {
        chai.request(server)
          .post('/api/threads/' +  test_board)
          .send({
            text: 'This is my test post',
            delete_password: 'delete'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
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
            console.log(res.body)
            done();
          });
      })
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
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
            assert.property(res.body, 'created_on')
            assert.property(res.body, 'bumped_on')
            assert.notProperty(res.body, 'delete_password')
            assert.notProperty(res.body, 'reported')
            done();
          });
      })
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
