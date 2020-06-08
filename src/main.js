import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

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
  render: h => h(App),
}).$mount('#app')
