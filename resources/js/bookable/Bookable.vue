<template>
  <div class="container">
    <preloader v-if="loading"></preloader>
    <not-found v-if="notFound"></not-found>
    <div v-else-if="!loading && !notFound" class="row">
      <fatal-error v-if="error"></fatal-error>
      <div v-if="!error" class="col-md-8">
        <router-link v-bind:to="{ name: 'bookables' }" class="mt-2">
          <i class="fas fa-arrow-left"></i>
          Back
        </router-link>
        <div class="card">
          <div class="card-header">
            <span class="float-right"
              >Price : <strong>₱ {{ bookable.price }}</strong></span
            >
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ bookable.title }}</h5>
            <p class="card-text">{{ bookable.description }}</p>
          </div>
        </div>

        <review-list :bookable-id="bookableId"></review-list>
      </div>
      <div class="col-md-4 mt-4">
        <availability
          :bookable-id="bookableId"
          v-on:availability="checkPrice($event)"
          class="mb-4"
        />

        <transition name="fade">
          <price-breakdown
            class="mb-4"
            v-if="price != 0"
            :price="price"
          ></price-breakdown>
        </transition>

        <transition>
          <button
            class="btn btn-primary btn-block"
            v-if="price != 0"
            @click="addToBasket"
            :class="inBasketAlready ? 'd-none' : ''"
          >
            Book now
          </button>
        </transition>

        <button
          class="btn btn-danger btn-block"
          v-if="inBasketAlready"
          @click="removeFromBasket"
        >
          Remove from basket
        </button>

        <div v-if="inBasketAlready" class="mt-3 text-muted warning text-center">
          Item is in the basket already.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Availability from "./Availability.vue";
import ReviewList from "./ReviewList.vue";
import PriceBreakdown from "./PriceBreakdown";
import validationErrors from "./../shared/mixins/validationErrors";
import { mapState } from "vuex";

export default {
  mixins: [validationErrors],
  components: {
    Availability,
    ReviewList,
    PriceBreakdown,
  },
  data() {
    return {
      bookable: [],
      bookableId: this.$route.params.id,
      loading: false,
      error: false,
      notFound: false,
      price: 0,
      numOfdays: 1,
    };
  },
  computed: {
    ...mapState({
      lastSearch: "lastSearch", // reused from index.vue vuex component GLOBAL STATE
    }),
    inBasketAlready() {
      // should be a state since we're mapping a state from the vuex
      if (this.bookable == null) {
        return false;
      }

      return this.$store.getters.inBasketAlready(this.bookable.id);
    },
  },
  methods: {
    async checkPrice(hasAvailability) {
      if (!hasAvailability) {
        this.price = 0;
        return;
      }

      try {
        this.price = (
          await axios.get(
            `/api/bookables/${this.bookable.id}/price?from=${this.lastSearch.from}&to=${this.lastSearch.to}`
          )
        ).data.data;
      } catch (error) {
        this.price = 0;
      }
    },
    addToBasket() {
      this.$store.dispatch("addToBasket", {
        bookable: this.bookable,
        price: this.price,
        dates: this.lastSearch,
      });
    },
    removeFromBasket() {
      this.$store.dispatch("removeFromBasket", this.bookable.id);
    },
  },
  async created() {
    this.loading = true;

    try {
      this.bookable = (
        await axios.get(`/api/bookables/${this.$route.params.id}`)
      ).data.data;
    } catch (error) {
      this.notFound = true;
    } finally {
      this.loading = false;
    }
  },
  beforeMount() {},
};
</script>

<style type="text/css">
.warning {
  font-size: 0.7rem;
}
</style>
