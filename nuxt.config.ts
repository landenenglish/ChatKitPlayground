// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'
import { APP_NAME } from './shared/constants/name'
import { preventFlash } from './utils/prevent-flash'
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@vueuse/nuxt'],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'openai-chatkit',
    },
  },

  runtimeConfig: {
    openaiApiKey: '', // Will be populated from NUXT_OPENAI_API_KEY env var (for future use)
    public: {
      workflowId: '', // Will be populated from NUXT_PUBLIC_WORKFLOW_ID env var
      domainKey: '', // Will be populated from NUXT_PUBLIC_DOMAIN_KEY env var
    },
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
      ripple: true,
    },
    autoImport: true,
  },

  css: ['primeicons/primeicons.css', 'assets/css/main.css'],

  app: {
    head: {
      title: APP_NAME,
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no',
        },
      ],
      script: [
        {
          innerHTML: `(${preventFlash.toString()})();`,
          tagPosition: 'bodyOpen',
          type: 'text/javascript',
        },
        {
          src: 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js',
          type: 'module',
        },
      ],
      style: [
        {
          innerHTML: `
            /* Ensure smooth appearance once loaded */
            html {
              opacity: 1;
              transition: opacity 0.1s ease;
            }
          `,
          tagPosition: 'bodyOpen',
        },
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          type: 'image/x-icon',
        },
        // Preconnect to OpenAI services for faster loading
        {
          rel: 'preconnect',
          href: 'https://cdn.platform.openai.com',
        },
        {
          rel: 'preconnect',
          href: 'https://api.openai.com',
        },
        {
          rel: 'preconnect',
          href: 'https://cdn.openai.com',
        },
        // Preload critical fonts
        {
          rel: 'preload',
          href: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  ssr: false,

  plugins: [{ src: '~/plugins/apply-theme.client.ts', mode: 'client' }],

  compatibilityDate: '2025-03-29',
})
