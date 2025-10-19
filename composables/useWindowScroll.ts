import { noop } from '@vueuse/core'

interface UseWindowScrollOptions {
  onAtBottom?: () => void
  onAlmostAtBottom?: () => void
  almostAtBottomPixels?: number
}

export const useWindowScroll = (options: UseWindowScrollOptions = {}) => {
  const {
    almostAtBottomPixels = 150,
    onAtBottom = noop,
    onAlmostAtBottom = noop,
  } = options

  const y = ref(0)
  const x = ref(0)
  const isAtBottom = ref(false)
  const isAlmostAtBottom = ref(false)

  const updateScroll = () => {
    y.value = window.scrollY
    x.value = window.scrollX

    const windowHeight = window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight

    const scrolledToBottom = windowHeight + window.scrollY >= scrollHeight

    isAtBottom.value = scrolledToBottom

    if (scrolledToBottom) {
      onAtBottom()
    }

    const almostAtBottom =
      windowHeight + window.scrollY >= scrollHeight - almostAtBottomPixels

    isAlmostAtBottom.value = almostAtBottom

    if (almostAtBottom) {
      onAlmostAtBottom()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScroll)
    updateScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
  })

  return {
    x: readonly(x),
    y: readonly(y),
    isAtBottom: readonly(isAtBottom),
    isAlmostAtBottom: readonly(isAlmostAtBottom),
  }
}
