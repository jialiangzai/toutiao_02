export default {
  namespaced: true,
  state: {
    photo: localStorage.getItem('TT_PT') || ''
  },
  mutations: {
    setPhoto (state, payload) {
      state.photo = payload
      localStorage.setItem('TT_PT', payload)
    }
  }
}
