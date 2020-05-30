// var sinon = require('sinon');
// var expect = require('chai').expect;
// var assert = require('chai').assert;
// var should = require('chai').should();
// var authorController =  require('../../controllers/authorController');
// const authors = require('../../models/author');
//
// describe('authorController', function () {
//     // Below, we are going to test HTTP functions, so we need to create fake request and respond object!
//
//     const mockResponse = (fake) => {
//         return {
//             send: fake
//         };
//     }
//
//     // this is just example how you can design the fake request, you can also add header property if your website needs one!
//     // I'm not even going to use any of these stuff inside request
//     const mockRequest = (session, body) => ({
//         session,
//         body,
//     });
//
//     // I just want to remind that using chai is easier to read
//     describe('getAllAuthor', function() {
//         //Checking length with style~, isntead of assert.equal(res.json.length, 2)
//         it("should have length of 2", function(){
//             const fake = sinon.fake();
//             const req = mockRequest({},{});
//             const res = mockResponse(fake);
//             authorController.getAllAuthors(req, res);
//             const result = fake.lastArg;
//             expect(result).to.have.lengthOf(2);
//             result.should.have.lengthOf(2);
//             assert.equal(result.length, 2);
//         })
//
//         it("Author should have id, first_name, and last_name", function(){
//             const fake = sinon.fake();
//             const req = mockRequest({},{});
//             const res = mockResponse(fake);
//
//             authorController.getAllAuthors(req,res);
//             const result = fake.lastArg;
//
//             result.forEach(element => {
//                 expect(element).to.have.property('id');//check one with chai
//                 expect(element).to.have.keys(['id', 'first_name', 'last_name']); //check everything with chai
//                 element.should.have.property('id'); // different way of checking using should
//                 // assert.equal(Object.keys(element), ['id', 'first_name', 'last_name']); Not going to work because it does strict equality, not deep comparison
//                 // but if you really insist...
//                 assert.deepEqual(Object.keys(element), ['id', 'first_name', 'last_name']); //check with assert
//             });
//         })
//
//         it('should return all authors', function(){
//             const fake = sinon.fake();
//             const req = mockRequest({},{});
//             const res = mockResponse(fake);
//
//             // Quick quiz! why didn't I write line 62 like line 61? HINT: I didn't forget and I am not lazy >:(
//             // let result = authorController.getAllAuthors(req,res);
//             authorController.getAllAuthors(req,res);
//             const result = fake.lastArg;
//             expect(result).to.deep.equal(authors); // Don't forget to use deep, you don't want to compare object id, you want to compare contents!
//         });
//   });
// });
//
//
// describe('simpleFunction', function(){
//     //Pure Mocha
//     it('should return true sum of 2 input', function(){
//         var sum = authorController.simpleFunction(1,2);
//         expect(sum).to.equal(3);
//     });
//
//     //Mocha + Chai, its longer, but make more sense to read
//     it('should return true sum of 2 input', function(){
//         var sum = authorController.simpleFunction(1,2);
//         expect(sum).to.be.equal(3);
//     });
//
//     it('should return error if no argument present', function(){
//         var sum = authorController.simpleFunction();
//         expect(sum).to.be.NaN;
//     })
//
//     it('should only calculate the first 2 number', function(){
//         var sum = authorController.simpleFunction(1,2,3);
//         expect(sum).to.be.equal(3);
//     })
//
//     it('should only result in numbers', function(){
//         let test = [{a:'1',b:2}, {a:[1], b:2}, {a:[1,'a'],b:2}];
//         test.forEach(element => {
//             var sum = authorController.simpleFunction(element.a,element.b);
//             expect(typeof(sum)).to.not.be.equal('number');
//         })
//         let sum = authorController.simpleFunction(1,2);
//         expect(typeof(sum)).to.be.equal('number');
//     })
// });
