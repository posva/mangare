/*global describe before after afterEach it :true*/
const dbURI = 'mongodb://localhost/test-mangare'
const should = require('should')
const sinon = require('sinon')
const path = require('path')
const mongoose = require('mongoose')
const mangaSchema = require('../../server/schemas/manga')
const api = require('../../server/api')
const clearDB = require('mocha-mongoose')(dbURI)
const nock = require('nock')
const mangareader = require('../../server/providers/mangareader')

const mangaFromList = {
  name: 'Naruto',
  uri: '/naruto',
  completed: true
}
const chapterFromList = {
  index: 1,
  uri: '/naruto/1',
  name: 'Uzumaki Naruto (1)'
}

describe('API', () => {
  'use strict'
  let Manga = mongoose.model('Manga', mangaSchema)

  before((done) => {
    if (mongoose.connection.db) {
      return done()
    }
    mongoose.connect(dbURI, done)
  })

  after((done) => {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    clearDB(done)
  })

  afterEach(() => {
    if (mangareader.getManga.restore) {
      mangareader.getManga.restore()
    }
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
      if (err) {
        return done(err)
      }
      api.mangaList(null, {send (mangas) {
        mangas.should.have.length(1)
        let m = mangas[0]
        m.should.have.property('uri', mangaDesc.uri)
        m.should.have.property('name', mangaDesc.name)
        m.should.have.property('completed', mangaDesc.completed)
        m.should.have.property('image', mangaDesc.image)
        m.should.have.property('chapterCount', 0)
        m.should.have.property('updatedAt')
        m.updatedAt.should.be.a.String
        new Date(m.updatedAt).should.be.a.Date
        should(m.chapters).not.be.ok()
        done()
      }})
    })
  })

  it('populates image and chapters only on first access', (done) => {
    nock(mangareader.host)
    .get(mangaFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto.html'))
    let manga = new Manga(mangaFromList)
    manga.save((err, doc) => {
      if (err) {
        return done(err)
      }

      doc.should.have.property('_id')
      doc.should.have.property('uri', mangaFromList.uri)
      doc.should.have.property('name', mangaFromList.name)
      doc.should.have.property('completed', mangaFromList.completed)
      doc.should.have.property('chapterCount', 0)
      should(doc.image).not.be.ok()
      should(doc.description).not.be.ok()
      doc.chapterCount.should.equal(0)
      doc.chapters.should.have.length(0)

      sinon.spy(mangareader, 'getManga')
      api.manga({params: {id: doc._id}}, {send (mangaDetail) {
        mangareader.getManga.callCount.should.be.eql(1)
        should(mangaDetail).be.ok()
        mangaDetail.image.should.be.ok()
        mangaDetail.should.have.property('chapterCount', 700)
        should(mangaDetail.updatedAt).be.ok()
        should(mangaDetail.description).be.ok()
        mangaDetail.should.not.have.property('__v')
        mangaDetail.chapters.length.should.be.eql(700)
        const chapter = mangaDetail.chapters[0]
        chapter.should.have.property('uri')
        chapter.should.have.property('name')
        chapter.should.have.property('_id')
        chapter.should.have.property('date')
        chapter.should.have.property('updatedAt')
        chapter.should.have.property('pageCount', 0)

        api.manga({params: {id: doc._id}}, {send (mangaDetail) {
          mangareader.getManga.callCount.should.be.eql(1)
          should(mangaDetail).be.ok()
          should(mangaDetail.updatedAt).be.ok()
          mangaDetail.should.not.have.property('__v')
          mangaDetail.image.should.be.ok()
          mangaDetail.chapters.length.should.be.eql(700)

          manga.remove(done)
        }})
      }})
    })
  })

  it('generates base64 from image', (done) => {
    let manga = new Manga(mangaFromList)
    manga.chapters.push({
      uri: '/naruto/1',
      name: 'Uzumaki Naruto',
      pages: [{
        uri: '/fake',
        image: 'http://i10.mangareader.net/naruto/1/naruto-1564773.jpg'
      } ]
    })

    const imageUrl = 'i10.mangareader.net/naruto/1/naruto-1564773.jpg'
    nock('https://images.weserv.nl')
    .get(`/?url=${imageUrl}&encoding=base64`)
    .reply(200, 'T0sk')
    manga.save((err, doc) => {
      if (err) {
        done(err)
      }
      api.imageBase64({query: {url: doc.chapters[0].pages[0].image}}, {send (encodedImage) {
        encodedImage.should.be.eql('T0sk')
        manga.remove(done)
      }, status () { return this }})
    })
  })

  it('let chapters array intact', (done) => {
    nock(mangareader.host)
    .get(mangaFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto.html'))
    nock(mangareader.host)
      .get(mangaFromList.uri)
      .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto.html'))

    let manga = new Manga(mangaFromList)
    manga.save((err, doc) => {
      if (err) return done(err)

      api.manga({params: {id: doc._id}}, {send (mangaDetail) {
        mangaDetail.chapters.should.not.be.empty()
        mangaDetail.chapters[0].should.have.property('pageCount', 0)
        const chapter = mangaDetail.chapters[0]

        // change pageCount (simulate an updates)
        // and force update
        Manga.update({
          _id: doc._id,
          'chapters._id': chapter._id
        }, {
          $set: {
            'chapters.$.pageCount': 50,
            // simulate last update from 1 week ago
            updatedAt: new Date() - 3600 * 24 * 7 * 1000
          }
        }, (err) => {
          if (err) return done(err)

          api.manga({params: {id: doc._id}}, {send (mangaDetail) {
            mangaDetail.chapters[0].should.have.property('pageCount', 50)
            manga.remove(done)
          }})
        })
      }})
    })
  })

  it('populates chapters pages only on first access', (done) => {
    nock(mangareader.host)
    .get(mangaFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto.html'))
    nock(mangareader.host)
    .get(chapterFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto-1.html'))

    // All pages
    for (let i = 1; i < 54; ++i) {
      nock(mangareader.host)
      .get(`${chapterFromList.uri}/${i}`)
      .replyWithFile(200, path.join(__dirname, `./fixtures/mangareader/naruto-${i}.html`))
    }

    let manga = new Manga(mangaFromList)
    manga.save((err, doc) => {
      if (err) {
        return done(err)
      }
      api.manga({params: {id: doc._id}}, {send (mangaDetail) {
        sinon.spy(mangareader, 'getPages')
        const req = {
          params: {
            id: mangaDetail._id,
            chapterId: mangaDetail.chapters[0]._id
          }
        }
        api.mangaChapter(req, {send (chapter) {
          mangareader.getPages.calledOnce.should.be.true()
          should(chapter).be.ok()
          should(chapter._id).be.ok()
          should(chapter.updatedAt).be.ok()
          should(chapter.date).be.ok()
          chapter.name.should.be.ok()
          chapter.uri.should.be.ok()
          chapter.pageCount.should.equal(53)
          chapter.pages.length.should.be.eql(53)

          api.mangaChapter(req, {send (chapter) {
            mangareader.getPages.calledOnce.should.be.true()
            should(chapter).be.ok()
            should(chapter.updatedAt).be.ok()
            should(chapter._id).be.ok()
            chapter.name.should.be.ok()
            chapter.uri.should.be.ok()
            chapter.pageCount.should.equal(53)
            chapter.pages.length.should.be.eql(53)
            const page = chapter.pages[0]
            page.should.be.a.String

            manga.remove(done)
          }, status () { return this }})
        }, status () { return this }})
      }})
    })
  })

  it('uses the provider if the last update is bigger than 1d', (done) => {
    nock(mangareader.host)
    .get(mangaFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/naruto.html'))
    sinon.spy(mangareader, 'getManga')

    // directly use mongo to hack updatedAt
    let updatedAt = new Date()
    let now = new Date()
    updatedAt.setMonth(updatedAt.getMonth() - 1)
    Manga.collection.insert(Object.assign({}, mangaFromList, {updatedAt, image: 'image'}))

    mangareader.getManga.callCount.should.be.eql(0)

    Manga.findOne({uri: mangaFromList.uri}, (err, doc) => {
      if (err) return done(err)
      mangareader.getManga.callCount.should.be.eql(0)

      api.manga({params: {id: doc._id}}, {send (mangaDetail) {
        should(mangaDetail).be.ok()
        mangareader.getManga.callCount.should.be.eql(1)

        api.manga({params: {id: doc._id}}, {send (mangaDetail) {
          mangareader.getManga.callCount.should.be.eql(1)
          doc.remove(done)
        }})
      }})
    })
  })
})
