const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../app');

const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');
const User = mongoose.model('User');

async function addUser() {
    const newUser = new User({
        name: 'Test',
        email: 'test@test.test',
        password: 'password'
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
            })
        });
    });
}

async function removeUsers() {
    await User.deleteMany({},  function (err) {})
    await User.collection.dropIndexes(function (err, results) {
            console.log(results)
    });
}

async function loginUser() {
    const user = {email: "test@test.test", password: "password"}
    const res = await request(app)
        .post('/users/login')
        .send(user);
    console.log(res)
}


module.exports.addUser = addUser
module.exports.removeUsers = removeUsers
module.exports.loginUser = loginUser