var expect = require("chai").expect;
var users = require("../users.js");
var request = require("request");
var baseURL = "https://www.reddit.com/search.json?&limit=10&sort=hot&sort=new&q='casa%20loma'";

//test1 basic npm test
describe("test", function () {
    it("pass because everything is ok", function () {
        expect(true).to.be.true;
    });
});

//test2 displays the name of our app users
describe("printName()", function () {
    it("print the last name first", function () {
        var results = users.printName({ first: "Elizabeth", last: "Porter" });
        expect(results).to.equal("Porter, Elizabeth");

        var results = users.printName({ first: "David", last: "Lapadula" });
        expect(results).to.equal("Lapadula, David");

        var results = users.printName({ first: "Derek", last: "Irwin" });
        expect(results).to.equal("Irwin, Derek");

        var results = users.printName({ first: "Angelina", last: "Davies" });
        expect(results).to.equal("Davies, Angelina");
    });
});

//test3 the reddit api test
describe("casa loma", function () {
    it("casa loma", function (done) {
        request.get({ url: baseURL }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

//test4 the POST route  test
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("POST /api/signup", function () {
    // Before each test begins, create a new request server for testing
    // & delete all examples from the db
    beforeEach(function () {
        request = chai.request(server);
        return db.sequelize.sync({ force: true });
    });

    it("should display the user", function (done) {
        // Create an object to send to the endpoint
        var reqBody = {
            displayName: "Angelina Davies",
            email: "angelina@gmail.com",
            password: "mysecret"
        };

        // POST the request body to the server
        request
            .post("/api/signup")
            .send(reqBody)
            .end(function (err, res) {
                var responseStatus = res.status;
                var responseBody = res.body;

                // Run assertions on the response

                expect(err).to.be.null;

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("object")
                    .that.includes(reqBody);

                // The `done` function is used to end any asynchronous tests
                done();
            });
    });
});


// the GET route test

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/allProjects", function () {
    // Before each test begins, create a new request server for testing
    // & delete all examples from the db
    beforeEach(function () {
        request = chai.request(server);
        return db.sequelize.sync();
    });

    it("should find all Projects", function (done) {
        // Add some examples to the db to test with
        db.Projects.findAll().then(function () {
            // Request the route that returns all examples
            request.get("/allProjects").end(function (err, res) {
                var responseStatus = res.status;
                var responseBody = res.body;

                // Run assertions on the response

                expect(err).to.equal(404);

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("array")
                    .that.has.lengthOf(2);

                expect(responseBody[0])
                    .to.be.an("object")
                    .that.includes({ text: "First Example", description: "First Description" });

                expect(responseBody[1])
                    .to.be.an("object")
                    .that.includes({ text: "Second Example", description: "Second Description" });

                // The `done` function is used to end any asynchronous tests
                done();
            });
        });
    });
});