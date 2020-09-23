import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { VBScrollspy } from 'bootstrap-vue'

Vue.directive('b-scrollspy', VBScrollspy)

import './assets/app.css'

Vue.use(BootstrapVue)

import { BIcon } from 'bootstrap-vue'
Vue.component('b-icon', BIcon)

window.$ = window.jQuery = require('jquery');

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')