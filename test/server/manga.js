/*global describe it beforeEach :true*/
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const mongoose = require('mongoose')
const mangaSchema = require('../../server/schemas/manga')
const pageSchema = require('../../server/schemas/page.js')
const clearDB = require('mocha-mongoose')(dbURI)

describe('Models', () => {
  'use strict'
  let Manga = mongoose.model('Manga', mangaSchema)
  beforeEach((done) => {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
  })

  after((done) => {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    clearDB(done)
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

  it('throws on wrong chapter', (done) => {
    let manga = new Manga({
      name: 'One Piece',
      uri: '/one-piece',
      completed: false,
      chapters: [{}]
    })
    manga.save((err, doc) => {
      should(err).be.ok()
      done()
    })
  })

  it('creates chapters', (done) => {
    let manga = new Manga({
      name: 'test',
      uri: '/test',
      completed: false,
      chapters: [
        {
          name: 'chapter 1',
          uri: '/one-piece/1',
          index: 1
        }
      ]
    })
    manga.save((err, doc) => {
      if (err) return done(err)
      should(doc).be.ok()
      done()
    })
  })
})
