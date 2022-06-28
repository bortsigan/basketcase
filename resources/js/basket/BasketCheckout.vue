<template>
  <div v-cloak>
    <preloader v-if="loading"></preloader>
    <success v-else-if="success">Thank you for adding a review!</success>
    <fatal-error v-else-if="!isValidForCheckout && !success"></fatal-error>
    <div v-else>
      <div class="row">
        <div class="col-md-3 font-weight-bold">Full Name</div>
        <div class="col-md-9">{{ customer.first_name }} {{ customer.last_name }}</div>
      </div>

      <div class="row mt-2">
        <div class="col-md-3 font-weight-bold">Email</div>
        <div class="col-md-9">{{ customer.email }}</div>
      </div>

      <div class="row mt-2">
        <div class="col-md-3 font-weight-bold">Address</div>
        <div class="col-md-9 justify-content-between">
          {{ customer.street }}, {{ customer.city }}, {{ customer.state }},
          {{ customer.country }} {{ customer.zip }}
        </div>
      </div>

      <div class="card mt-3">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <th>Hotel</th>
              <th>Date</th>
              <th>Total Price</th>
            </thead>
            <tbody>
              <tr v-for="item in basket" :key="item.bookable.id">
                <td>
                  <router-link
                    :to="{ name: 'bookable', params: { id: item.bookable.id } }"
                    >{{ item.bookable.title }}</router-link
                  >
                </td>
                <td>
                  {{ item.dates.from | formatDate }} ~
                  {{ item.dates.to | formatDate }} &nbsp;&nbsp;
                  <span class="font-weight-bold">
                    {{ computeDaysAndNights(item.dates.from, item.dates.to) }}
                  </span>
                </td>
                <td>₱{{ item.price.total | formatPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-block mt-2" @click.prevent="book">
        BOOK!
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import format from "./../shared/mixins/format";
import moment from "moment";

export default {
  mixins: [format],
  data() {
    return {
      loading: false,
      isBooked: false,
      errors: "",
    };
  },
  computed: {
    ...mapGetters(["itemsInBasket", "customer"]),
    ...mapState({
      basket: (state) => state.basket.items,
      //customer: (state) => state.customer,
    }),
    totalPayables() {
      let payable = 0;
      for (let i = 0; i < this.basket.length; i++) {
        payable += this.basket[i].price.total;
      }

      return payable;
    },
    success() {
      return !this.loading && !this.errors && this.isBooked;
    },
    isValidForCheckout() {
      return (
        Object.keys(this.customer).length !== 0 &&
        this.itemsInBasket !== 0 &&
        !this.loading &&
        !this.success
      );
    },
  },
  methods: {
    computeDaysAndNights(from, to) {
      let start = moment(from);
      let end = moment(to);
      let days = parseInt(end.diff(start, "days"));
      return `(${days}D${days - 1}N)`;
    },
    async book() {
      this.loading = true;
      this.isBooked = false;
      this.errors = null;
      try {
        await axios.post(`/api/checkout`, {
          customer: this.customer,
          bookings: this.basket.map((basketItem) => ({
            bookable_id: basketItem.bookable.id,
            from: basketItem.dates.from,
            to: basketItem.dates.to,
          })),
        });
        this.$store.dispatch("clearBasket");
        this.$store.dispatch("clearCustomer");
      } catch (error) {
        this.errors = error.response && error.response.data.errors; // this.errors is from mixins validation errors
      } finally {
        this.isBooked = this.errors ? false : true;
        this.loading = false;
      }
    },
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
