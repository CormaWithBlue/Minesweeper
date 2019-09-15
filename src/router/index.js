import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import MineSweeper from '@/components/MineSweeper'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: "MineSweeper",
    component: MineSweeper
  }]
})
