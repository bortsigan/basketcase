<template>
  <div>
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <h5 class="my-0 mr-md-auto font-weight-normal">
        <strong>
          <router-link :to="{ name: 'bookables' }">VnB</router-link>
        </strong>
      </h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <router-link
          exact-active-class="active"
          v-bind:class="`p-2 text-dark`"
          v-bind:to="{ name: 'bookables' }"
          >Bookables</router-link
        >
        <router-link
          active-class="active"
          v-bind:class="`p-2 text-dark`"
          v-bind:to="{ name: 'example', params: { id: 1 } }"
          >Example</router-link
        >
        <router-link class="btn nav-button" :to="{ name: 'basket' }">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="itemsInBasket" class="badge badge-secondary">{{
            itemsInBasket
          }}</span>
        </router-link>
      </nav>

      <a class="btn btn-outline-primary" href="#">Sign up</a>
    </div>

    <div class="container mt-4 mb-4 pr-4 pl-4">
      <!-- render views !-->
      <div class="card">
        <div class="card-header">Header</div>
        <div class="card-body">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      lastSearch: this.$store.state.lastSearch,
    };
  },
  computed: {
    ...mapState({
      //lastSearchComputed: state => state.lastSearchComputed
      lastSearchComputed: "lastSearch",
    }),
    ...mapGetters({
      itemsInBasket: "itemsInBasket",
      ///customer: "customer",
    }),
  },
};
</script>
