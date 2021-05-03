import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import Vue from 'vue'
import { chartInfo } from './modules/chartInfo'
import { dialogueInfo } from './modules/dialogueInfo'
import { directoryInfo } from './modules/directoryInfo'
import { editor } from './modules/editor'
import { graphInfo } from './modules/graphInfo'

// for debug
Vue.config.devtools = true

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {
    editor,
    directoryInfo,
    graphInfo,
    chartInfo,
    dialogueInfo
  }
}

export default new Vuex.Store<RootState>(store)
