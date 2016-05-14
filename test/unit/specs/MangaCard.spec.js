import Vue from 'vue'
import MangaCard from 'src/components/MangaCard'

describe('MangaCard.vue', () => {
  let vm, mangaCard
  before(() => {
    vm = new Vue({
      data: {
        manga: {
          _id: 'id',
          name: 'Naruto',
          chapterCount: 700,
          completed: true,
          description: 'Description',
          image: 'image'
        }
      },
      el: 'body',
      replace: false,
      template: `<div><manga-card
        :manga="manga"
        v-ref:comp
      ></manga-card></div>`,
      components: { MangaCard }
    })
    mangaCard = vm.$refs.comp
  })

  it('contains a manga information', () => {
    mangaCard.$('.manga-card__title').should.have.text('Naruto')
    mangaCard.$('.manga-card__information__chapters').should.contain.text(700)
    mangaCard.$('.manga-card__information__chapters').should.contain.text(700)
    mangaCard.$('.manga-card__information__description').should.have.text('Description')
  })

  it('displays a placeholder when no image', () => {
    mangaCard.image.should.equal('image')
    vm.manga.image = ''
    mangaCard.image.should.match(/placehold/)
    vm.manga.image = 'image'
  })

  it('has a route', () => {
    mangaCard.route.should.eql({
      name: 'manga',
      params: {
        mangaId: 'id'
      }
    })
  })

  it('makes the title fit', (done) => {
    let size = parseInt(
      window.getComputedStyle(mangaCard.$('.manga-card__title')).fontSize, 10)
    size.should.equal(1.5 * 16)
    vm.manga.name = 'This is just a longer text so that the size is lower than before'
    vm.$raf().then(() => {
      size = parseInt(
        window.getComputedStyle(mangaCard.$('.manga-card__title')).fontSize, 10)
      size.should.be.below(1.5 * 16)
    }).then(done, done)
  })
})
