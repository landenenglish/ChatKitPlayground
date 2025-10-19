export const preventFlash = () => {
  try {
    const state = JSON.parse(localStorage.getItem('appThemeState') || '')
    if (!state) return

    if (state.darkMode) {
      document.documentElement.classList.add('p-dark')
    }

    document.documentElement.style.visibility = 'hidden'

    const showContent = () => (document.documentElement.style.visibility = '')

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () =>
        setTimeout(showContent, 50)
      )
    } else {
      setTimeout(showContent, 50)
    }
  } catch {
    document.documentElement.style.visibility = ''
  }
}
