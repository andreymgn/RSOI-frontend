import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Categories from './views/Categories.vue'
import Category from './views/Category.vue'
import Reports from './views/Reports.vue'
import Comments from './views/Comments.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import NewApp from './views/NewApp.vue'
import OAuthLogin from './views/OAuthLogin.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/categories/:uid',
      name: 'category',
      component: Category
    },
    {
      path: '/categories/:categoryuid/post/:uid',
      name: 'post',
      component: Comments
    },
    {
      path: '/categories/:categoryuid/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/oauth/register',
      name: 'newApp',
      component: NewApp
    },
    {
      path: '/oauth/authorize',
      name: 'oauthLogin',
      component: OAuthLogin
    },
    {
      path: '/422',
      name: 'UnprocessableEntity',
      component: () => import(/* webpackChunkName: "UnprocessableEntity" */ './views/UnprocessableEntity.vue'),
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import(/* webpackChunkName: "NotFound" */ './views/NotFound.vue'),
    }
  ]
})
