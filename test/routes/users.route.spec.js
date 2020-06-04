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



describe('usersRoute', async function () {
    //preferences route
    describe('preferences', async function() {
        before(helper.addUser)

        //Get preferences form
        describe('/GET /users/preferences', async function() {

            //When logged in
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
                it('Should render preferences for a logged in user', async function() {
                    const res = await authSession
                        .get('/users/preferences');
                    expect(res.statusCode).to.equal(200);
                })
            })

            //When not logged in
            describe('loggedOut', async function() {
                it('Should redirect an unauthorized user to login', async function() {
                    const res = await request(app)
                        .get('/users/preferences');
                    expect(res.statusCode).to.equal(302);
                    expect(res.redirect).to.equal(true);
                    expect(res.header).to.deep.include({location: '/users/login'})
                })
            })
        })

        //Post new preferences
        describe('/POST /users/preferences', async function() {
            var authSession = null;
            after(helper.removeSiteSubs)
            before(function (done) {
                authSession = session(app);
                authSession.post('/users/login')
                    .send({email: "test@test.test", password: "password"})
                    .end(function (err) {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('Should redirect to dashboard', async function() {
                const body = {siteSelection: '[{"siteId":"4afe6adc-cbac-4bf1-afbe-ff98d59564f9","siteName":"Melbourne CBD"}]', statusSelection: 3}
                const res = await authSession
                    .post('/users/preferences')
                    .send(body);
                expect(res.statusCode).to.equal(302);

                //redirected to preferences
                expect(res.redirect).to.equal(true);
                expect(res.header).to.deep.include({location: '/dashboard'})
            })
        })
    })

    //preferences route
    describe('account', async function() {
        beforeEach(helper.addUser)

        //Get account form
        describe('/GET /users/account', async function() {

            //When logged in
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
                it('Should render account for a logged in user', async function() {
                    const res = await authSession
                        .get('/users/account');
                    expect(res.statusCode).to.equal(200);
                })
            })

            //When not logged in
            describe('loggedOut', async function() {
                it('Should redirect an unauthorized user to login', async function() {
                    const res = await request(app)
                        .get('/users/account');
                    expect(res.statusCode).to.equal(302);
                    expect(res.redirect).to.equal(true);
                    expect(res.header).to.deep.include({location: '/users/login'})
                })
            })
        })

        //Post account update
        describe('/POST /users/update', async function() {
            after(helper.removeUsers)
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
            it('Should redirect to dashboard', async function() {
                const body = {email: 'test@test2.test', password: "password"}
                const res = await authSession
                    .post('/users/update')
                    .send(body);
                expect(res.statusCode).to.equal(302);

                //redirected to preferences
                expect(res.redirect).to.equal(true);
                expect(res.header).to.deep.include({location: '/dashboard'})
            })
        })

        //Post account delete
        describe('/POST /users/delete', async function() {
            before(helper.removeUsers)
            before(helper.addUser)
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
            it('Should redirect to dashboard', async function() {
                const body = {password: "password"}
                const res = await authSession
                    .post('/users/delete')
                    .send(body);
                expect(res.statusCode).to.equal(302);

                //redirected to preferences
                expect(res.redirect).to.equal(true);
                expect(res.header).to.deep.include({location: '/dashboard'})
            })
        })
    })

    //Redirecting user/* unused routes
    describe('redirect', async function () {
        before(helper.addUser)
        //When not logged in
        describe('redirectLoggedOut', function() {
            it('Should redirect to dashboard if an undefined user endpoint is supplied', async function () {
                const res = await request(app)
                    .get('/users/test');
                expect(res.statusCode).to.equal(302);
                expect(res.redirect).to.equal(true);
            })
        })

        //when logged in
        describe('redirectLoggedIn', function() {
            var authSession = null;
            before(function(done) {
                authSession = session(app);
                authSession.post('/users/login')
                    .send({email: "test@test.test", password: "password"})
                    .end(function (err) {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('Should redirect to dashboard if an undefined user endpoint is supplied', async function () {
                const res = await authSession
                    .get('/users/test');
                expect(res.statusCode).to.equal(302);
                expect(res.redirect).to.equal(true);
            })
        })
    })
})