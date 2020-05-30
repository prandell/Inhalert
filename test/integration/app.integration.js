// var expect = require('chai').expect;
// const supertest = require('supertest');
// const app = require('../../app');
// const authors = require('../../models/author');
//
// // This section of simulate a test when your application IS RUNNING, we are testing by DECLARING ROUTES, and see if it returns the correct data
// describe('integration test', function() {
//     describe('getAllAuthor', function(){
//         context('check if we can get all author', function(){
//             it('get all authors', function(done){
//                 supertest(app)
//                 .get('/author-management')
//                 .send({})
//                 .end(function(err, res) {
//                     // if you don't understand or unsure where does res.body or res.statusCode come form, read more regarding HTTP response
//                     // or even better read the whole Hypertext Transfer Protocol (HTTP) request-respond protocol
//                     expect(res.statusCode).to.equal(200);
//                     expect(res.body).to.deep.equal(authors);
//                     res.body.forEach(element=>{
//                         expect(element).to.have.property('id');
//                         expect(element).to.have.keys(['id', 'first_name', 'last_name']);
//                     })
//                     done();
//                 })
//             })
//         })
//     });
//
//     describe('addAuthor', function(){
//         context('check if we can add an author', function(){
//             it('post an author', async function(){
//                 let newAuthor = {id:'10003', first_name:'Candy', last_name:'Crystal'};
//                 let newAuthors = [...authors, newAuthor];
//                 const res = await supertest(app)
//                     .post('/author-management')
//                     .send(newAuthor);
//
//                 expect(res.statusCode).to.equal(200);
//                 expect(res.type).to.equal('application/json');
//                 expect(res.body).to.deep.equal(newAuthors);
//             })
//         })
//     })
// })