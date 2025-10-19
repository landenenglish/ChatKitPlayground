import { applyAppTheme } from '~/composables/useAppTheme'

export default defineNuxtPlugin({
  name: 'apply-theme',
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', () => {
      const state = localStorage.getItem('appThemeState')
      if (state) {
        applyAppTheme(JSON.parse(state))
      }
    })
  },
})
