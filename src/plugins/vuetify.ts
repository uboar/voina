// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

//const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    //defaultTheme: defaultTheme
    defaultTheme: "light"
  }
})
