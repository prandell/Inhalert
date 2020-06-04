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

describe('userController', async function () {
    before(helper.removeUsers)
    describe('registerUser', function() {

        beforeEach(helper.removeUsers)

        //All validation checks should work! Checking for actual messages
        describe('validationChecks', async function() {
            before(helper.addUser)

            describe('requiredFields', async function () {
                it('Should return 400 if a field is missing', async function() {
                    const user = {name: "", email: "test@test.test", password: "password", password2: "password"}
                    const res = await request(app)
                        .post('/users/register')
                        .send(user);
                    expect(res.statusCode).to.equal(400);
                    expect(res.text).to.include('Name is required')
                })
            })

            describe('passwordLength', async function () {
                it('Should return 400 if password is too short', async function() {
                    const user = {name: "Test", email: "test@test.test", password: "pass", password2: "pass"}
                    const res = await request(app)
                        .post('/users/register')
                        .send(user);
                    expect(res.statusCode).to.equal(400);
                    expect(res.text).to.include('Password must be at least 6 Characters')
                })
            })

            describe('emailType', async function () {
                it('Should return 400 if email is not of the correct format', async function() {
                    const user = {name: "Test", email: "test.test", password: "password", password2: "password"}
                    const res = await request(app)
                        .post('/users/register')
                        .send(user);
                    expect(res.statusCode).to.equal(400);
                    expect(res.text).to.include('Email is not valid')
                })
            })

            describe('passwordMatch', async function () {
                it('Should return 400 if passwords dont match', async function() {
                    const user = {name: "Test", email: "test@test.test", password: "password", password2: "password1"}
                    const res = await request(app)
                        .post('/users/register')
                        .send(user);
                    expect(res.statusCode).to.equal(400);
                    expect(res.text).to.include('Passwords don\'t match')
                })
            })

        })

        describe('/POST /users/register', async function() {
            before(helper.removeUsers)
            it('Should add new user to database and redirect', async function() {
                const user = {name: "Test", email: "test@test.test", password: "password", password2: "password"}
                const res = await request(app)
                    .post('/users/register')
                    .send(user);
                expect(res.statusCode).to.equal(302);

                //redirected to preferences
                expect(res.redirect).to.equal(true);
                expect(res.header).to.deep.include({location: '/users/preferences'})

                //Added to database
                var result = await User.find({}).exec()
                expect(result).to.have.lengthOf(1)
                expect(result[0]).to.include({name: "Test", email: "test@test.test"})

                //Should store hashed password!
                expect(result[0]).to.not.include({password: "password"})

            })
        })

        describe('/GET /users/register', async function() {
            it('Should render register form', async function() {
                const res = await request(app)
                    .get('/users/register');
                expect(res.statusCode).to.equal(200);
            })
        })
    })

    describe('loginUser', async function() {
        before(helper.addUser)

        describe('validationChecks', async function() {
            describe('requiredFields', async function () {
                it('Should return 401 and not authenticate if a field is missing', async function() {
                    const user = {email: "", password: "password"}
                    const res = await request(app)
                        .post('/users/login')
                        .send(user);
                    expect(res.text).to.include('Missing credentials')
                    expect(res.statusCode).to.equal(401);
                    expect(res.unauthorized).to.equal(true);
                })
            })

            describe('wrongEmail', async function () {
                it('Should return 401 and not authenticate if email doesnt exist', async function() {
                    const user = {email: "test@test", password: "password"}
                    const res = await request(app)
                        .post('/users/login')
                        .send(user);
                    expect(res.text).to.include('That email is not registered')
                    expect(res.statusCode).to.equal(401);
                    expect(res.unauthorized).to.equal(true);
                })
            })

            describe('wrongPassword', async function () {
                it('Should return 401 and not authenticate if wrong password', async function() {
                    const user = {email: "test@test.test", password: "password1"}
                    const res = await request(app)
                        .post('/users/login')
                        .send(user);
                    expect(res.text).to.include('Password incorrect')
                    expect(res.statusCode).to.equal(401);
                    expect(res.unauthorized).to.equal(true);
                })
            })
        })

        describe('/POST /users/login', async function() {
            it('Should successfully login and redirect to dashboard', async function() {
                const user = {email: "test@test.test", password: "password"}
                const res = await request(app)
                    .post('/users/login')
                    .send(user);
                expect(res.statusCode).to.equal(302);

                //redirected to preferences
                expect(res.redirect).to.equal(true);
                expect(res.unauthorized).to.equal(false);
                expect(res.header).to.deep.include({location: '/dashboard'})
            })
        })

        describe('/GET /users/login', async function() {
            it('Should render login form', async function() {
                const res = await request(app)
                    .get('/users/login');
                expect(res.statusCode).to.equal(200);
            })

            describe('loggedIn', async function() {

                var authSession = null;
                before(function (done) {
                    authSession = session(app);
                    authSession.post('/users/login')
                        .send({email: "test@test.test", password: "password"})
                        .end(function (err) {
                            if (err) return done(err);
                            return done();
                        });
                });

                it('Should re-direct a logged-in user', async function() {
                    const res = await authSession
                        .get('/users/login');
                    expect(res.statusCode).to.equal(302);
                    expect(res.header).to.deep.include({location: '/dashboard'})
                    expect(res.redirect).to.equal(true);
                })
            })
        })
    })

    describe('logoutUser', async function() {
        var authSession = null;
        before(function (done) {
            authSession = session(app);
            authSession.post('/users/login')
                .send({email: "test@test.test", password: "password"})
                .end(function (err) {
                    if (err) return done(err);
                    return done();
                });
        });

        it('Should logout a logged in user', async function() {
            const res = await authSession
                .get('/users/logout');
            expect(res.statusCode).to.equal(302);
            expect(res.header).to.deep.include({location: '/dashboard'})
            expect(res.redirect).to.equal(true);
        })
    })

});
