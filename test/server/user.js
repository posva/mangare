/*global describe it after before :true*/
process.env.NODE_ENV = 'testing'
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const mongoose = require('mongoose')
const userSchema = require('../../server/schemas/user')
const clearDB = require('mocha-mongoose')(dbURI)
const request = require('supertest')
const app = require('../../server/app')

function connectToMongo () {
  if (mongoose.connection.db) {
    return Promise.resolve()
  } else {
    return new Promise(resolve => mongoose.connect(dbURI, resolve))
  }
}

describe('User', () => {
  'use strict'
  let User = mongoose.model('User', userSchema)

  before((done) => {
    app.get('/api/fake-me', function (req, res) {
      should(req.user).not.be.ok()
      res.sendStatus(200)
    })

    connectToMongo()
      .then(done)
  })

  after((done) => {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    clearDB(done)
  })

  it('saves password hash', (done) => {
    let user = new User({
      username: 'test 0',
      password: 'secret'
    })
    user.save((err, user) => {
      should(err).be.null()
      should(user).be.ok()
      user.password.should.not.eql('secret')
      done()
    })
  })

  describe('Auth', () => {
    it('register a user', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'test 1',
          password: 'posva'
        })
        .expect(200, () => {
          User.findOne({username: 'test 1'}, (err, user) => {
            should(err).be.null()
            should(user).be.ok()
            done()
          })
        })
    })

    it('fails registering a incomplete user', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'test 2'
        })
        .expect(500, () => {
          request(app)
            .post('/api/register')
            .send({
              password: 'test 2'
            })
            .expect(500, () => {
              User.findOne({username: 'test 2'}, (err, user) => {
                should(err).be.null()
                should(user).not.be.ok()
                done()
              })
            })
        })
    })

    it('generates a token upon successful login', (done) => {
      let user = new User({
        username: 'test 3',
        password: 'secret'
      })
      user.save((err, user) => {
        should(err).be.null()
        should(user).be.ok()
        request(app)
          .post('/api/auth-token')
          .send({
            username: 'test 3',
            password: 'secret'
          })
          .expect(200, (err, resp) => {
            should(err).be.null()
            should(resp).be.ok()
            resp.body.token.should.be.a.String()
            done()
          })
      })
    })

    it('populates req with the user when using the token', (done) => {
      const userData = {
        username: 'test 4',
        password: 'secret'
      }
      const user = new User(userData)
      user.save((err, user) => {
        should(err).be.null()
        should(user).be.ok()
        request(app)
          .post('/api/auth-token')
          .send(userData)
          .expect(200, (err, resp) => {
            should(err).be.null()
            const token = resp.body.token
            request(app)
              .get('/api/me')
              .set({
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`
              })
              .expect(200, (err, resp) => {
                should(err).be.null()
                should(resp).be.ok()
                resp.body.username.should.eql('test 4')
                done()
              })
          })
      })
    })

    it('lets anonymous access the api', (done) => {
      request(app)
        .get('/api/fake-me')
        .expect(200, (err, resp) => {
          should(err).be.null()
          done()
        })
    })
  })
})
