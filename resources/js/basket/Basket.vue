<template>
  <div>
    <preloader v-if="loading"></preloader>
    <success v-else-if="success">You're booking request has been added!</success>
    <div class="row" v-else>
      <div class="col-md-8">
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="firstName">First Name</label>
            <input
              v-model="customer.first_name"
              type="text"
              class="form-control"
              id="firstName"
              placeholder="First Name"
              :class="[{ 'is-invalid': errorFor('customer.first_name') }]"
            />
            <v-errors :errors="errorFor('customer.first_name')"></v-errors>
          </div>

          <div class="col-md-6 form-group">
            <label for="lastName">Last Name</label>
            <input
              v-model="customer.last_name"
              type="text"
              class="form-control"
              id="lastName"
              placeholder="Last Name"
              :class="[{ 'is-invalid': errorFor('customer.last_name') }]"
            />
            <v-errors :errors="errorFor('customer.last_name')"></v-errors>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 form-group">
            <label for="email">E-mail</label>
            <input
              v-model="customer.email"
              type="text"
              class="form-control"
              id="email"
              placeholder="E-mail"
              :class="[{ 'is-invalid': errorFor('customer.email') }]"
            />
            <v-errors :errors="errorFor('customer.email')"></v-errors>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="street">Street</label>
            <input
              v-model="customer.street"
              type="text"
              class="form-control"
              id="street"
              placeholder="Street"
              :class="[{ 'is-invalid': errorFor('customer.street') }]"
            />
            <v-errors :errors="errorFor('customer.street')"></v-errors>
          </div>

          <div class="col-md-6 form-group">
            <label for="city">City</label>
            <input
              v-model="customer.city"
              type="text"
              class="form-control"
              id="city"
              placeholder="City"
              :class="[{ 'is-invalid': errorFor('customer.city') }]"
            />
            <v-errors :errors="errorFor('customer.city')"></v-errors>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 form-group">
            <label for="country">Country</label>
            <input
              v-model="customer.country"
              type="text"
              class="form-control"
              id="country"
              placeholder="Country"
              :class="[{ 'is-invalid': errorFor('customer.country') }]"
            />
            <v-errors :errors="errorFor('customer.country')"></v-errors>
          </div>

          <div class="col-md-4 form-group">
            <label for="state">State</label>
            <input
              v-model="customer.state"
              type="text"
              class="form-control"
              id="state"
              placeholder="State"
              :class="[{ 'is-invalid': errorFor('customer.state') }]"
            />
            <v-errors :errors="errorFor('customer.state')"></v-errors>
          </div>

          <div class="col-md-4 form-group">
            <label for="zip">Zip</label>
            <input
              v-model="customer.zip"
              type="text"
              class="form-control"
              id="zip"
              placeholder="Zip"
              :class="[{ 'is-invalid': errorFor('customer.zip') }]"
            />
            <v-errors :errors="errorFor('customer.zip')"></v-errors>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12 form-group">
            <button
              type="submit"
              class="btn btn-large btn-block btn-primary"
              @click.prevent="validateCheckout"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="d-flex justify-content-between">
          <h4 class="text-secondary font-weight-bolder">Your Cart</h4>
          <h4 class="text-uppercase text-center">
            <span class="badge badge-dark float-right">{{ itemsInBasket }}</span>
          </h4>
        </div>

        <div class="pt-4" :class="hasBookingErrors ? 'text-center' : 'd-none'">
          <span class="text-danger">No bookings added!</span>
        </div>

        <transition-group v-if="!hasBookingErrors">
          <!-- iterate the bindings in the basket !-->
          <div v-for="item in basket" :key="item.bookable.id">
            <div class="pt-2 pb-2 border-top d-flex justify-content-between">
              <span>
                <router-link
                  :to="{ name: 'bookable', params: { id: item.bookable.id } }"
                  >{{ item.bookable.title }}</router-link
                >
              </span>
              <span class="font-weight-bold">₱{{ item.price.total | formatPrice }}</span>
            </div>

            <div class="pt-2 pb-2 d-flex justify-content-between">
              <span>
                {{ item.dates.from | formatDate }} ~ {{ item.dates.to | formatDate }}
              </span>
            </div>

            <div class="pt-2 pb-2 text-right">
              <!-- call the dispatch method directly instead of creating local method !-->
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="$store.dispatch('removeFromBasket', item.bookable.id)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
  <!-- end template !-->
</template>

<script>
import { mapGetters, mapState } from "vuex";
import validationErrors from "./../shared/mixins/validationErrors";
import format from "./../shared/mixins/format";
import axios from "axios";

export default {
  mixins: [validationErrors, format],
  data() {
    return {
      customer: {
        first_name: this.$store.state.customer.first_name,
        last_name: this.$store.state.customer.last_name,
        email: this.$store.state.customer.email,
        street: this.$store.state.customer.street,
        city: this.$store.state.customer.city,
        country: this.$store.state.customer.country,
        state: this.$store.state.customer.state,
        zip: this.$store.state.customer.zip,
      },
      loading: false,
      isBooked: false,
      toRedirect: false,
    };
  },
  computed: {
    ...mapGetters(["itemsInBasket"]),
    ...mapState({
      basket: (state) => state.basket.items,
    }),
    success() {
      return !this.loading && !this.errors && this.isBooked;
    },
    hasBookingErrors() {
      return this.errors && typeof this.errors.bookings !== "undefined";
    }
  },
  methods: {
    async validateCheckout() {
      this.loading = true;
      this.isBooked = false;
      this.errors = null;

      try {
        await axios.post(`/api/checkout/validate`, {
          customer: this.customer,
          bookings: this.basket.map((basketItem) => ({
            bookable_id: basketItem.bookable.id,
            from: basketItem.dates.from,
            to: basketItem.dates.to,
          })),
        });
        this.$store.dispatch("setCustomer", this.customer);
        this.$router.push({ name: "basket-checkout" });
      } catch (error) {
        this.errors = error.response && error.response.data.errors; // this.errors is from mixins validation errors
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
h6.badge {
  font-size: 100%;
}

a {
  color: black;
}
</style>
