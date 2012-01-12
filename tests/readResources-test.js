var vows = require('vows');
var assert = require('assert');

var resty = require('../lib/resty');
var readResources = resty._readResources;

vows.describe('Read Resources').addBatch({
  'Read a valid resource folder': {
    topic: function() {
      return readResources(__dirname + '/../example/resources');
    },

    'nested resource is within parent': function(resources) {
      assert.notEqual(resources.users.contacts, undefined);
    },

    'each level contains a _main': function(resources) {
      assert.notEqual(resources.users._main, undefined);
      assert.notEqual(resources.songs._main, undefined);
      assert.notEqual(resources.users.contacts._main, undefined);
    },

    '_main should have a Resource and Collection object': function(resources) {
      assert.notEqual(resources.users._main.Resource, undefined);
      assert.notEqual(resources.users._main.Collection, undefined);
    },

    '_main.Resource get should be a function': function(resources) {
      assert.equal(typeof resources.users._main.Resource.get, 'function');
    }
  },

  'Read an invalid resource folder': {
    topic: function() {
      return readResources(__dirname + '/does/not/exist');
    },

    'should return an Error object': function(resources) {
      assert.equal(resources.code, 'ENOENT');
    }
  }
})['export'](module);

