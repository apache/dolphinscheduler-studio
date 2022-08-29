import { studioRoutes } from '../../studio'
import type { RouteRecordRaw } from 'vue-router'

const pages: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/studio'),
    children: []
  },
  ...studioRoutes
]

export default pages
