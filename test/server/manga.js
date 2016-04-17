/*global describe it beforeEach :true*/
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const mongoose = require('mongoose')
const Manga = require('../../server/models/manga.js')
require('mocha-mongoose')(dbURI)

describe('Manga', () => {
  'use strict'
  beforeEach((done) => {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
  })

  it('is empty on creation', (done) => {
    Manga.find((err, mangas) => {
      if (err) return done(err)
      mangas.should.have.length(0)
      done()
    })
  })

  it('creates a document', (done) => {
    let manga = new Manga({
      name: 'Naruto',
      uri: '/naruto',
      completed: true
    })
    manga.save((err, doc) => {
      if (err) return done(err)
      should(doc).be.ok()
      Manga.find((err, mangas) => {
        if (err) return done(err)
        mangas.should.have.length(1)
        done()
      })
    })
  })
})
