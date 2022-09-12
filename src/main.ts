import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import './assets/css/main.styl'
import BaseComponents from './components/base'
import BaseDirective from './directive'
import {createPinia} from 'pinia'
import ECharts from 'vue-echarts'

const app = createApp(App)
app.component('v-chart', ECharts)
app.use(BaseComponents)
app.use(BaseDirective)
app.use(createPinia())

app.use(store).use(router).mount('#app')
