import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('../views/SupportView.vue'),
    },
    {
      path: '/support/:category',
      name: 'support-detail',
      component: () => import('../views/SupportDetailView.vue'),
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('../views/UpdatesView.vue'),
    },
    {
      path: '/suggest-feature',
      name: 'suggest-feature',
      component: () => import('../views/SuggestFeature.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicy.vue'),
    },
    {
      path: '/terms-of-use',
      name: 'terms-of-use',
      component: () => import('../views/TermsOfUse.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'home',
      component: HomeView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

export default router
