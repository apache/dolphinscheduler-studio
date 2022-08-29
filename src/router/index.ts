import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
