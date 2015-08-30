var request = require('supertest');
var mockery = require('mockery');
var should = require('chai').should();

describe('GET /', function() {
  var app;

  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false
    });
    mockery.registerMock('../me', { name: 'Test User' });
    mockery.registerMock('../config', {
      settings: {},
      modules: {
        github: {
          path: '/path',
          data: {}
        }
      }
    });
    app = require('../lib/app');
  });

  after(function() {
    mockery.disable();
  });

  it('Responds with values of ./me', function(done) {
    request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      res.body.should.not.be.empty;
      res.body.should.have.property('me');
      res.body.me.name.should.equal('Test User');
    })
    .end(done);
  });

  it('Has routes specified in ./config', function(done) {
    request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      res.body.should.not.be.empty;
      res.body.should.have.property('routes');
      res.body.routes.should.deep.equal(['/path']);
    })
    .end(done);
  });
});
