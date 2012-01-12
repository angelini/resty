var Songs = {
  Resource: {
    get: function(sid, callback) {
      callback(null, {sid: sid});
    }
  },

  Collection: {
    get: function(callback) {
      callback(null, {all: 'songs'});
    }
  }
};

module.exports = Songs;
