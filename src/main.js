import Vue from 'vue'
import App from './App.vue'

// Import bootstrap css
import 'bootstrap/dist/css/bootstrap.css';

// Import font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

// Automatically transform <i></i> to <svg></svg>
import { dom } from '@fortawesome/fontawesome-svg-core'
dom.watch()

new Vue({
  el: '#app',
  render: h => h(App)
})
