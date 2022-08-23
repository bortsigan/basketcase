<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <h5 class="my-0 mr-md-auto font-weight-normal">
        <strong>
          <router-link :to="{ name: 'bookables' }">VnB</router-link>
        </strong>
      </h5>

      <!-- Left Side Of Navbar -->
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'basket' }">
            <i class="fas fa-shopping-cart"></i>
            <span v-if="itemsInBasket" class="badge badge-secondary">{{
              itemsInBasket
            }}</span>
          </router-link>
        </li>

        <li class="nav-item" v-if="isLoggedIn">
          <router-link :to="{ name: 'bookables' }" class="nav-link"
            >Bookables</router-link
          >
        </li>

        <li class="nav-item" v-if="!isLoggedIn">
          <router-link :to="{ name: 'register' }" class="nav-link">Register</router-link>
        </li>

        <li class="nav-item" v-if="!isLoggedIn">
          <router-link :to="{ name: 'login' }" class="nav-link">Login</router-link>
        </li>

        <li class="nav-item" v-if="isLoggedIn">
          <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
        </li>
      </ul>
    </nav>

    <div class="container mt-4 mb-4 pr-4 pl-4">
      <!-- render views !-->
      <div class="card" v-if="isLoggedIn">
        <div class="card-header">Header</div>
        <div class="card-body">
          <router-view></router-view>
        </div>
      </div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { isLoggedIn } from "./shared/utils/auth";

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
      isLoggedIn: "isLoggedIn",
    }),
    ...mapGetters({
      user: "user",
      itemsInBasket: "itemsInBasket",
      ///customer: "customer",
    }),
  },
  methods: {
    async logout() {
      try {
        axios.post("/logout");
        this.$store.dispatch("logout");
        this.$router.push({ name: "login" });
      } catch (error) {
        this.$store.dispatch("logout");
      }
    },
  }
};
</script>
