import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }]
    },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/major',
    name: '专业管理',
    component: Layout,
    redirect: '/major/list',
    meta: { roles: ['admin'], title: '专业管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '专业列表',
        component: () => import('@/views/major/list'),
        meta: { roles: ['admin'], title: '专业列表' }
      },
      {
        path: 'reqs',
        name: '毕业要求',
        component: () => import('@/views/major/reqs'),
        meta: { roles: ['admin'], title: '毕业要求管理' }
      },
      {
        path: 'points',
        name: '指标点管理',
        component: () => import('@/views/major/points'),
        meta: { roles: ['admin'], title: '指标点管理' }
      },
      {
        path: 'students',
        name: '学生管理',
        component: () => import('@/views/major/students'),
        meta: { roles: ['admin'], title: '学生管理' }
      },
    ]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: '课程管理',
    meta: { roles: ['admin'], title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/subject/list'),
        meta: { roles: ['admin'], title: '课程列表' }
      },
      {
        path: 'goal',
        name: '课程目标管理',
        component: () => import('@/views/subject/goal'),
        meta: { roles: ['admin'], title: '课程目标管理' }
      }
    ]
  },

  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: '开课管理',
    meta: { roles: ['admin'], title: '开课管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: '开课列表',
        component: () => import('@/views/course/list'),
        meta: { roles: ['admin'], title: '开课列表'}
      },
      {
        path: 'teacher',
        name: '教师管理',
        component: () => import('@/views/course/teacher'),
        meta: { roles: ['admin'], title: '教师管理'}
      },
      {
        path: 'term',
        name: '学期管理',
        component: () => import('@/views/course/term'),
        meta: { roles: ['admin'], title: '学期管理'}
      },
      {
        hidden: true,
        path: 'detail',
        name: '开课详情',
        component: () => import('@/views/course/detail'),
        meta: { roles: ['admin'], title: '开课详情'}
      },
      {
        path: 'goalScoreList',
        name: '按课号查达成度',
        component: () => import('@/views/course/goalScoreList'),
        meta: { roles: ['admin'], title: '按课号查达成度'}
      },
    ]
  },
  {
    path: '/myCourse',
    component: Layout,
    redirect: '/myCourse/list',
    name: '我的课程',
    meta: { roles: ['teacher'], title: '我的课程', icon: 'table' },
    children: [
      {
        path: 'list',
        name: '列表',
        component: () => import('@/views/myCourse/index'),
        meta: { roles: ['teacher'], title: '我的课程'}
      },
      {
        hidden: true,
        path: 'detail',
        name: '开课详情',
        component: () => import('@/views/course/detail'),
        meta: { roles: ['teacher'], title: '开课详情'}
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
