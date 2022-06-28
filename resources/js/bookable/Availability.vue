<template>
  <div>
    <h6 class="text-uppercase text-secondary">
      <strong>Check Availability</strong>
      <transition>
        <span v-if="noAvailability" class="text-danger font-weight-bold">
          (Not Available)
        </span>
        <span v-if="hasAvailability" class="text-success font-weight-bold">
          (Available)
        </span>
      </transition>
    </h6>

    <div class="row">
      <div class="col-md-6">
        <label for="from"><strong>From</strong> </label>

        <input
          v-model="from"
          @keyup.enter="check"
          type="date"
          name="from"
          class="form-control form-control-sm"
          placeholder="Start Date"
          autocomplete="false"
          :class="[{ 'is-invalid': this.errorFor('from') }]"
        />
        <v-errors :errors="errorFor('from')"></v-errors>
      </div>

      <div class="col-md-6">
        <label for="to"><strong>To</strong> </label>

        <input
          v-model="to"
          @keyup.enter="check"
          type="date"
          name="to"
          class="form-control form-control-sm"
          placeholder="End Date"
          autocomplete="false"
          :class="[{ 'is-invalid': this.errorFor('to') }]"
        />
        <v-errors :errors="errorFor('to')"></v-errors>
      </div>
    </div>

    <!-- <button class="btn btn-primary btn-block" v-on:click="check" >Check Availability <i class="fas fa-search"></i> </button> -->
    <button class="btn btn-outline-secondary btn-block mt-3" @click="check">
      <span v-if="!loading"> Check Availability </span>
      <span v-if="loading">
        Checking... <i class="fas fa-circle-notch fa-spin"></i>
      </span>
    </button>
  </div>
</template>

<script>
import { is422 } from "../shared/utils/response";
import validationErrors from "./../shared/mixins/validationErrors";

export default {
  mixins: [validationErrors],
  props: {
    bookableId: [String, Number],
  },
  data() {
    return {
      from: this.$store.state.lastSearch.from,
      to: this.$store.state.lastSearch.to,
      loading: false,
      status: "",
      errors: "",
    };
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      const date =
        today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
      const mdy =
        today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

      return mdy;
    },
    async check() {
      this.loading = true;
      this.errors = "";

      this.$store.dispatch("setLastSearch", {
        from: this.from,
        to: this.to,
      });

      try {
        this.status = (
          await axios.get(
            `/api/bookables/${this.bookableId}/availability?from=${this.from}&to=${this.to}`
          )
        ).status;

        this.$emit("availability", this.hasAvailability);
      } catch (error) {
        if (is422(error)) {
          this.errors = error.response.data.errors;
        }
        this.status = error.response.status;
        this.$emit("availability", this.hasAvailability);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    hasErrors() {
      return 422 === this.status && this.errors !== null;
    },
    hasAvailability() {
      return 200 === this.status;
    },
    noAvailability() {
      return 404 === this.status;
    },
  },
};
</script>

<style scoped>
label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: gray;
  font-weight: bolder;
}

.is-invalid {
  border-color: #b22222;
  background-image: none;
}

.invalid-feedback {
  color: #b22222;
}
</style>
