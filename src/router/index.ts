import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/signin'
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/dashboard',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/prodi',
      name: 'Prodi',
      component: () => import('../views/Admin/prodi/ProdiView.vue'),
      meta: {
        title: 'Data Program Studi',
        roles: ['Admin']
      },
    },
    {
      path: '/topik-ta',
      name: 'Topik TA',
      component: () => import('../views/Admin/topik_ta/TopikTaView.vue'),
      meta: {
        title: 'Data Topik TA',
        roles: ['Admin']
      },
    },
    {
      path: '/keahlian-dosen',
      name: 'Keahlian Dosen',
      component: () => import('../views/Admin/keahlian_dosen/KeahlianDosenView.vue'),
      meta: {
        title: 'Data Keahlian Dosen',
        roles: ['Admin', 'Kaprodi', 'Dosen']
      },
    },
    {
      path: '/dosen',
      name: 'Dosen',
      component: () => import('../views/Admin/user/DosenView.vue'),
      meta: {
        title: 'Dosen',
        roles: ['Admin', 'Kaprodi']
      },
    },
    {
      path: '/mahasiswa',
      name: 'Mahasiswa',
      component: () => import('../views/Admin/user/MahasiswaView.vue'),
      meta: {
        title: 'Mahasiswa',
        roles: ['Admin', 'Kaprodi']
      },
    },
    {
      path: '/matching-ta',
      name: 'Matching TA',
      component: () => import('../views/kaprodi/matching_ta/MatchingTAView.vue'),
      meta: {
        title: 'Matching TA',
        roles: ['Kaprodi']
      },
    },
    {
      path: '/penugasan-penguji',
      name: 'Penugasan Penguji',
      component: () => import('../views/kaprodi/penugasan/PenugasanDosenView.vue'),
      meta: {
        title: 'Penugasan Penguji',
        roles: ['Kaprodi']
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },


    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title || 'App'} | System Pemilihan Penguji TA`

  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'

  let userRoles: string[] = []
  if (isAuthenticated) {
    try {
      userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]')
    } catch {
      userRoles = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim())
    }
  }

  if (to.name !== 'Signin' && to.name !== 'Signup' && !isAuthenticated) {
    next({ name: 'Signin' })
  }
  else if ((to.name === 'Signin' || to.name === 'Signup') && isAuthenticated) {
    next({ name: 'Ecommerce' })
  }
  else {
    if (to.meta.roles) {
      const requiredRoles = to.meta.roles as string[]
      const hasAccess = userRoles.some(role => requiredRoles.includes(role))

      if (!hasAccess) {
        alert('Akses Ditolak! Kanjeng Ratu tidak memiliki izin ke halaman ini.')
        return next({ name: 'Ecommerce' })
      }
    }
    next()
  }
})
