import { mutations } from 'src/vuex/store'

describe.skip('Vuex Mutations', () => {
  it('updates a specific manga', () => {
    let state = {
      mangaList: [
        {
          _id: 0,
          name: '',
          description: '',
          uri: '',
          completed: false,
          updatedAt: '',
          chapterCount: null
        }
      ]
    }
    mutations.UPDATE_MANGA(state, {
      _id: 0,
      name: 'name',
      description: 'description',
      image: 'image',
      uri: 'uri',
      completed: true,
      updatedAt: 'updatedAt',
      chapterCount: 0,
      extraData: 'should not appear'
    })

    const manga = state.mangaList[0]

    manga._id.should.equal(0)
    manga.name.should.equal('name')
    manga.image.should.equal('image')
    manga.description.should.equal('description')
    manga.uri.should.equal('uri')
    manga.completed.should.equal(true)
    manga.updatedAt.should.equal('updatedAt')
    manga.chapterCount.should.equal(0)
    should.not.exist(manga.extraData)
  })
})
