const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const Browser = require('zombie');
let browser;

suite('Functional Tests', function () {
  this.timeout(5000);

  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai.request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });

    // #2
    test('Test GET /hello with your name', function (done) {
      chai.request(server)
        .keepOpen()
        .get('/hello?name=Miguel')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Miguel');
          done();
        });
    });

    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai.request(server)
        .keepOpen()
        .put('/travellers')
        .type('json')
        .send({ surname: 'Colombo' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Cristoforo');
          assert.equal(res.body.surname, 'Colombo');
          done();
        });
    });

    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai.request(server)
        .keepOpen()
        .put('/travellers')
        .type('json') // opcional, pero queda consistente
        .send({ surname: 'da Verrazzano' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
          done();
        });
    });
  });

  // ------------------------------------------------------------

  suite('Functional Tests with Zombie.js', function () {
    suiteSetup(function (done) {
      browser = new Browser();
      browser.site = 'http://127.0.0.1:3000/';
      browser.visit('/', done);
    });

    suite('Headless browser', function () {
      test('should have a working "site" property', function () {
        assert.isNotNull(browser.site);
      });
    });

    suite('"Famous Italian Explorers" form', function () {
      // #5
      test('Submit the surname "Colombo" in the HTML form', function (done) {
        browser.fill('surname', 'Colombo');
        browser.pressButton('submit', function () {
          assert.equal(browser.text('span#name'), 'Cristoforo');
          assert.equal(browser.text('span#surname'), 'Colombo');
          done();
        });
      });

      // #6
      test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser.fill('surname', 'Vespucci');
        browser.pressButton('submit', function () {
          assert.equal(browser.text('span#name'), 'Amerigo');
          assert.equal(browser.text('span#surname'), 'Vespucci');
          done();
        });
      });
    });
  });
});
