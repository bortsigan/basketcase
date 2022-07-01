import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import VueMoment from "vue-moment";

import router from "./routes";
import moment from "moment";

import Index from "./Index";
import StarRating from "./shared/components/StarRating";
import FatalError from "./shared/components/FatalError";
import NotFound from "./shared/components/NotFound";
import Success from "./shared/components/Success";
import PreLoader from "./shared/components/PreLoader";
import ValidationErrors from "./shared/components/ValidationErrors";
import storeDef from "./store";
import axios from "axios";

require('./bootstrap');

window.Vue = require('vue');

Vue.use(VueRouter);
Vue.use(VueMoment); 
Vue.use(Vuex);  

Vue.component("star-rating", StarRating);
Vue.component("fatal-error", FatalError);
Vue.component("success", Success);
Vue.component("not-found", NotFound);
Vue.component("preloader", PreLoader);
Vue.component("v-errors", ValidationErrors);
Vue.filter("fromNow", value => moment(value).fromNow());

const store = new Vuex.Store(storeDef);
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (401 === error.response.status) {
            store.dispatch("logout"); // from vuex
        }

        return Promise.reject(error);
    }
);
const app = new Vue({
    el: '#app',
    router: router,
    store,
    components: {
        Index
    },
    async beforeCreate() {
        this.$store.dispatch('loadStoredState');
        this.$store.dispatch('loadUser');
    }
});
