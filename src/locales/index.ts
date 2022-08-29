import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en_US',
  messages: {
    zh_CN: {},
    en_US: {}
  }
})

export default i18n
