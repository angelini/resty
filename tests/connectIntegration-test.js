var vows = require('vows');
var assert = require('assert');

var connect = require('connect');
var request = require('request');
var resty = require('../lib/resty');

var app = connect.createServer();
app.use(resty.middleware(__dirname + '/../example/resources'));
app.listen(3131);

vows.describe('Using connect').addBatch({
  'testing Collection get request': {
    'topic': function() {
      request('http://127.0.0.1:3131/users', this.callback);
    },

    'should contain {all: "users"}': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).all, 'users');
    }
  },

  'testing Resource get request': {
    'topic': function() {
      request('http://127.0.0.1:3131/users/123', this.callback);
    },

    'should contain {uid: 123}': function(err, res, body) {
      assert.isNull(err);
      assert.equal(JSON.parse(body).uid, '123');
    }
  }
})['export'](module);

