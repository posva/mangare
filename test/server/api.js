/*global describe it beforeEach :true*/
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const mongoose = require('mongoose')
const mangaSchema = require('../../server/schemas/manga')
const pageSchema = require('../../server/schemas/page')
const api = require('../../server/api')
const clearDB = require('mocha-mongoose')(dbURI)
const _ = require('lodash')

describe('API', () => {
  'use strict'
  let Manga = mongoose.model('Manga', mangaSchema)

  before((done) => {
    if (mongoose.connection.db)
      return done()
    mongoose.connect(dbURI, done)
  })

  after((done) => {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    clearDB(done)
  })

  it('generates a manga list', (done) => {
    let mangaDesc = {
      name: 'Naruto',
      uri: '/mangalisttest',
      image: 'test',
      completed: true
    }
    let manga = new Manga(mangaDesc)
    manga.save((err, doc) => {
      if (err)
        return done(err)
      api.mangaList(null, {send (mangas) {
        mangas.should.have.length(1)
        let m = mangas[mangas.length - 1]
        m.should.have.property('uri', mangaDesc.uri)
        m.should.have.property('name', mangaDesc.name)
        m.should.have.property('completed', mangaDesc.completed)
        m.should.have.property('image', mangaDesc.image)
        should(m.updatedAt).not.be.ok()
        should(m.chapters).not.be.ok()
        done()
      }})
    })
  })
})
