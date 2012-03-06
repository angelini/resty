# Resty [![Build Status](https://secure.travis-ci.org/SoapyIllusions/resty.png)](http://travis-ci.org/SoapyIllusions/resty.png)

Build quick and simple RESTfull APIs using Node.js and connect

## Description

Resty is a connect middleware which let's you build a simple REST interface for your application. I have found it especially useful when building single page web apps which need a server-side API.

The resources are all laid out in a simple directory structure which helps build a clean perspective of how people can interact with your API.

## Installation

    npm install resty

## Usage

Simply require the middleware and tell connect to use it:

    var connect = require('connect');
    var resty = require('resty');

    var app = connect.createServer();
    app.use(resty.middleware('/path/to/resources/folder'));
    app.listen(8080);

Remember to add middleware for authentication and file serving, as resty only provides the routing for the API resources.

## Resource Folder

Here is what an example resource folder may look like:

    ├── songs
    │   └── songs.js
    └── users
        ├── contacts
        │   └── contacts.js
        └── users.js

Where a file with the same name as the parent directory will contain the Resources methods and any subfolders are nested resources.

## Resource Method

An over-simplified user resource may look like this:

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
    }

    module.exports = Users;

Users.Resource will be called if the url was `/users/123` and Users.Collection will be called if the url was `/users/`.
