export default defineNuxtConfig({
  srcDir: 'src/',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/style.css'],
  app: {
    head: {
      title: 'Студенческое общежитие',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/cat.png'
        }
      ]
    }
  }
})