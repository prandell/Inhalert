require('../config')
const app = require('../../app')
const helper = require('../helper')

const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();
const request = require('supertest');
var session = require('supertest-session');

const userController =  require('../../controllers/users');
const User = mongoose.model('User');

// router.get('/', function(req, res) {
//     res.redirect('/');
// });
//
// //Load preference form
// router.get('/preferences', ensureAuthenticated, prefController.userSubscribed);
//
// //Add Site preference
// router.post('/preferences', ensureAuthenticated, prefController.selectSite);

describe('usersRoute', function () {

})