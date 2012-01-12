var Users = {
  Resource: {
    get: function(uid, callback) {
      callback(null, {uid: uid, query: this.query});
    }
  },

  Collection: {
    get: function(callback) {
      callback(null, {all: 'users'});
    }
  }
};

module.exports = Users;
