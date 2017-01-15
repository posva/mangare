/* global describe it before :true */
const should = require('should')
const nock = require('nock')
const path = require('path')

const mangafox = require('../../server/providers/mangafox.js')

const mangaFromList = {
  name: 'Naruto',
  uri: '/read-manga/naruto',
  completed: null
}
const chapterFromList = {
  _id: 1,
  uri: '/read-manga/naruto/naruto-0-v01',
  name: 'Naruto 0 vol 1 : Naruto Pilot Manga'
}

describe('Mangafox.site', () => {
  before(() => {
    nock(mangafox.host)
    .get('/list')
    .replyWithFile(200, path.join(__dirname, './fixtures/mangafox/list.html'))

    nock(mangafox.host)
    .get(mangaFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangafox/naruto.html'))

    nock(mangafox.host)
    .get(chapterFromList.uri)
    .replyWithFile(200, path.join(__dirname, './fixtures/mangafox/naruto-0.html'))
  })

  it('should get the list of mangas', done => {
    mangafox.getList()
    .then(list => {
      list.should.have.length(126)
      let manga = list[0]
      manga.should.have.property('name')
      manga.should.have.property('uri')
      manga.should.have.property('completed')
      done()
    })
    .catch(done)
  })

  it('should get a specific manga', done => {
    mangafox.getManga(mangaFromList)
    .then(manga => {
      manga.should.have.property('name', 'Naruto')
      manga.should.have.property('alternate', '火影忍者, 狐忍, นินจาคาถาโอ้โฮเฮะ, 나루토, NARUTO―ナルト―, Naruto Shippuden')
      manga.should.have.property('chapters')
      manga.should.have.property('description')
      manga.description.should.match(/Nine-tailed Demon Fox /)
      manga.should.have.property('image', 'http://images.gogomanga.me/naruto/naruto.jpg')
      manga.chapters.should.have.length(746)
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
    mangafox.getPages(chapterFromList)
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
