import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './styles.css';

Vue.config.productionTip = false;

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faPaperPlane, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser, faPaperPlane, faUsers);

Vue.use(Buefy, {defaultIconPack: 'fas', defaultIconComponent: 'fa-icon'});
Vue.component('fa-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export function getLang() {
   if (navigator.languages != undefined) {
    return navigator.languages[0]; 
   } else {
    return navigator.language;
   } 
}
