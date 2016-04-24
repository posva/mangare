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
      should(doc.image).not.be.ok()
      doc.chapters.should.have.length(0)

      sinon.spy(mangareader, 'getManga')
      api.manga({params: {id: doc._id}}, {send (mangaDetail) {
        mangareader.getManga.callCount.should.be.eql(1)
        should(mangaDetail).be.ok()
        mangaDetail.image.should.be.ok()
        mangaDetail.should.not.have.property('__v')
        mangaDetail.chapters.length.should.be.eql(700)

        api.manga({params: {id: doc._id}}, {send (mangaDetail) {
          mangareader.getManga.callCount.should.be.eql(1)
          should(mangaDetail).be.ok()
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
          chapter.name.should.be.ok()
          chapter.uri.should.be.ok()
          chapter.pages.length.should.be.eql(53)

          api.mangaChapter(req, {send (chapter) {
            mangareader.getPages.calledOnce.should.be.true()
            should(chapter).be.ok()
            should(chapter._id).be.ok()
            chapter.name.should.be.ok()
            chapter.uri.should.be.ok()
            chapter.pages.length.should.be.eql(53)
            const page = chapter.pages[0]
            page.should.be.a.String

            manga.remove(done)
          }, status () { return this }})
        }, status () { return this }})
      }})
    })
  })
})
