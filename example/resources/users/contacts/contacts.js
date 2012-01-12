var Contacts = {
  Resource: {
    get: function(uid, cid, callback) {
      callback(null, {uid: uid, cid: cid});
    },

    post: function(uid, cid, callback) {
      callback(null, {body: this.body});
    }
  },

  Collection: {
    get: function(uid, callback) {
      callback(null, {uid: uid, all: 'contacts'});
    }
  }
};

module.exports = Contacts;
