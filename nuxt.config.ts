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
      script: [
        {
          innerHTML: `(${preventFlash.toString()})();`,
          tagPosition: 'bodyOpen',
          type: 'text/javascript',
        },
        {
          src: 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js',
          defer: true,
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
      ],
    },
  },

  plugins: [{ src: '~/plugins/apply-theme.client.ts', mode: 'client' }],

  compatibilityDate: '2025-03-29',

  imports: {
    dirs: ['shared/constants'],
  },

  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
})
