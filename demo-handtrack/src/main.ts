import store from './js/store'
import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'
import './css/global.scss'
import './css/item.scss'
import { ElCarousel, ElCarouselItem, ElDialog } from 'element-plus'
import 'element-plus/lib/theme-chalk/el-icon.css'

const components = [ElCarousel, ElCarouselItem, ElDialog]

const start = async () => {
  //获取数据
  await store.initData()
  //创建并挂载dom
  const app = createApp(App)
  components.forEach(component => {
    app.component(component.name, component)
  })
  app.mount('#app')
}

window.onload = () => {
  start()
}
