var vows = require('vows');
var assert = require('assert');

var resty = require('../lib/resty');
var isInt = resty._isInt;

vows.describe('Is Int').addBatch({
  'testing an integer Number': {
    topic: function() {
      return isInt(3);
    },
    'is an int': function(topic) {
      assert.isTrue(topic);
    }
  },
  
  'testing a float Number': {
    topic: function() {
      return isInt(3.123);
    },
    'is not an int': function(topic) {
      assert.isFalse(topic);
    }
  },

  'testing an integer String': {
    topic: function() {
      return isInt('3');
    },
    'is an int': function(topic) {
      assert.isTrue(topic);
    }
  },

  'testing a float String': {
    topic: function() {
      return isInt('3.123');
    },
    'is an int': function(topic) {
      assert.isFalse(topic);
    }
  }
})['export'](module);

