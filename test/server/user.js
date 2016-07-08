/*global describe it after beforeEach :true*/
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const mongoose = require('mongoose')
const userSchema = require('../../server/schemas/user')
const clearDB = require('mocha-mongoose')(dbURI)

describe.only('User', () => {
  'use strict'
  let User = mongoose.model('User', userSchema)
  beforeEach((done) => {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
  })

  after((done) => {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    clearDB(done)
  })

  it('saves password hash', (done) => {
    let user = new User({
      username: 'posva',
      password: 'secret'
    })
    user.save((err, user) => {
      should(err).be.null()
      should(user).be.ok()
      user.password.should.not.eql('secret')
      done()
    })
  })
})
