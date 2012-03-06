var PORT = 3131;
var BASE_URL = 'http://127.0.0.1:' + PORT;

var vows = require('vows');
var assert = require('assert');

var connect = require('connect');
var request = require('request');
var resty = require('../lib/resty');

var app = connect.createServer();
app.use(connect.query());
app.use(connect.bodyParser());
app.use(resty.middleware(__dirname + '/../example/resources'));
app.listen(PORT);

vows.describe('Using connect').addBatch({
  'testing Collection get request': {
    'topic': function() {
      request(BASE_URL + '/users', this.callback);
    },

    'should contain {all: "users"}': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).all, 'users');
    }
  },

  'testing extra slash on Collection get request': {
    'topic': function() {
      request(BASE_URL + '/users/', this.callback);
    },

    'should contain {all: "users"}': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).all, 'users');
    }
  },

  'testing Resource get request': {
    'topic': function() {
      request(BASE_URL + '/users/123', this.callback);
    },

    'should contain {uid: 123}': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).uid, '123');
    }
  },

  'testing nested Resource get request': {
    'topic': function() {
      request(BASE_URL + '/users/123/contacts/456', this.callback);
    },

    'should contain a uid and cid': function(err, res, body) {
      assert.isNull(err);
      body = JSON.parse(body);
      assert.equal(body.uid, '123');
      assert.equal(body.cid, '456');
    }
  },

  'testing querystring support': {
    'topic': function() {
      request(BASE_URL + '/users/123?hello=world', this.callback);
    },

    'should have accessed the querystring': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).query.hello, 'world');
    }
  },

  'testing POST and body support': {
    'topic': function() {
      request({
        uri: BASE_URL + '/users/123/contacts/456',
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, this.callback);
    },

    'should have accessed the body': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).body.test, 'data');
    }
  },

  'invalid resource request': {
    'topic': function() {
      request(BASE_URL + '/does/not/exist', this.callback);
    },

    'should return Resource Not Found': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).error, 'Resource Not Found');
    }
  },

  'invalid method request': {
    'topic': function() {
      request({
        uri: BASE_URL + '/users/123',
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, this.callback);
    },

    'should return Method Not Found': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).error, 'Method Not Found');
    }
  }
})['export'](module);

