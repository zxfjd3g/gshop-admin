import {data} from '@/api'
const state = {
  reportData: {}
}

const mutations = {
  SET_REPORT_DATA (state, reportData) {
    state.reportData = reportData
  }
}

const actions = {
  async getReportData ({commit}) {
    const result = await data.getReportData()
    console.log('----result', result)
    const reportData = result.data
    commit('SET_REPORT_DATA', reportData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
