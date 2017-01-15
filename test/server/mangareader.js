/* global describe it before :true */
'use strict'
const should = require('should')
const nock = require('nock')
const path = require('path')

const mangareader = require('../../server/providers/mangareader.js')

const mangaFromList = {
  name: 'Naruto',
  uri: '/naruto',
  completed: true
}
const chapterFromList = {
  _id: 1,
  uri: '/naruto/1',
  name: 'Uzumaki Naruto (1)'
}

describe('Mangareader.net', () => {
  before(() => {
    nock(mangareader.host)
    .get('/alphabetical')
    .replyWithFile(200, path.join(__dirname, './fixtures/mangareader/list.html'))

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
  })

  it('should get the list of mangas', done => {
    mangareader.getList()
    .then(list => {
      list.should.have.length(4094)
      let manga = list[0]
      manga.should.have.property('name')
      manga.should.have.property('uri')
      manga.should.have.property('completed')
      done()
    })
    .catch(done)
  })

  it('should get a specific manga', done => {
    mangareader.getManga(mangaFromList)
    .then(manga => {
      manga.should.have.property('name', 'Naruto')
      manga.should.have.property('alternate', '???,Naruto')
      manga.should.have.property('chapters')
      manga.should.have.property('description')
      manga.description.should.match(/a great demon/)
      manga.should.have.property('image', 'http://s3.mangareader.net/cover/naruto/naruto-l0.jpg')
      manga.chapters.should.have.length(700)
      manga.chapters.forEach(chapter => {
        chapter.should.have.property('_id')
        chapter.should.have.property('uri')
        chapter.should.have.property('date')
        chapter.should.have.property('name')
        chapter.name.should.match(/[0-9]+/)
      })
      done()
    })
    .catch(done)
  })

  it('should get a specific chapter', done => {
    mangareader.getPages(chapterFromList)
    .then(pages => {
      pages.forEach(page => {
        page.should.have.property('uri')
        should(page.uri).be.ok()
        page.should.have.property('image')
        should(page.image).be.ok()
      })
      done()
    })
    .catch(done)
  })
})
