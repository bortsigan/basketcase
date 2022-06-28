<template>
    <div>
        <success v-if="success">Thank you for adding a review!</success>
        <fatal-error v-if="error"></fatal-error>
        <not-found v-else-if="notFound"></not-found>
        <div v-else-if="!success && !error">
            <div class="row">
                <div :class="[{'col-md-4': twoColumns}, {'d-none': oneColumn}]">
                    <div class="card">
                        <div class="card-body">
                            <div v-if="loading">Loading</div>
                            <div v-if="hasBooking">
                                <p> You stayed at
                                    <router-link :to="{ name : 'bookable', params : {id : booking.bookable.bookable_id }}">
                                        {{ booking.bookable.title}}
                                    </router-link>
                                </p>
                                <p>
                                    From <strong>{{ booking.from | formatDate }}</strong> to <strong>{{ booking.to | formatDate }}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div :class="[{'col-md-8': twoColumns}, {'col-md-12': oneColumn}]">
                    <div v-if="loading">Page is loading.. </div>
                    <div v-else>
                        <div class="form-group">
                            
                            <label class="text-muted" v-if="!alreadyReviewed">Select the star rating (1 is worst - 5 is best)</label>

                            <star-rating v-model="review.rating" class="fa-3x" :is-reviewed="alreadyReviewed">
                            <!-- :value="review.rating" pass the props that sets the value for the child from the parent" !-->
                            <!-- :input="review.rating" handle the event after being passed from the child component !-->
                            </star-rating>
                        </div>

                        <div class="form-group" v-bind:class="[alreadyReviewed ? 'd-none' : '']">
                            <label for="content" class="text-muted">Describe your experience with us</label>
                            <textarea 
                                name="content" 
                                cols="30" 
                                rows="10" 
                                class="form-control" 
                                placeholder="Write your experience here ..." 
                                v-model="review.content"
                                :class="[{'is-invalid': errorFor('content')}]"
                            ></textarea>
                            <v-errors :errors="errorFor('content')"></v-errors>
                        </div>

                        <div class="form-group" v-bind:class="[!alreadyReviewed ? 'd-none' : '']">
                            {{ review.content }}
                        </div>
                        
                        <button @click.prevent="submit" :disabled="sending" type="button" class="btn btn-primary btn-block" v-bind:class="[alreadyReviewed ? 'd-none' : '']">Submit</button>
                        
                        <!-- already reviewed !-->
                        <div class="alert alert-primary text-center" v-bind:class="[alreadyReviewed ? '' : 'd-none']"> You've already left a review for this booking! </div>
                    </div>
                </div>
            </div>        
        </div>

    </div>
</template>

<script>
import { is404 } from "./../shared/utils/response";
import format from "./../shared/mixins/format";
import validationErrors from "./../shared/mixins/validationErrors";
import moment from "moment";

export default {
    mixins: [validationErrors, format],
    data() {
        return {
            review: {
                id : null,
                rating : 5,
                content : null
            },
            existingData : null,
            booking : null,
            loading : false,
            error : false,
            errors: null,
            notFound : false,
            sending: false,
            success: false
        }
    },
    async created() {
        this.loading = true;
        this.review.id = this.$route.params.id;

        try {
            this.existingData = (await axios.get(`/api/reviews/${this.review.id}`)).data.data;
            this.review.rating = this.existingData.rating;
        } catch(err) {
            if (is404(err)) {
                try {
                    this.booking = (await axios.get(`/api/booking-by-review/${this.review.id}`)).data.data;
                } catch(err) {
                    this.error = !is404(err);
                    this.notFound = true;
                }
            } else {
                this.error = true;
            }
        } finally {
            this.loading = false;
        }
    },
    computed: {
        hasReview() {
            return this.existingData != null;
        },
        hasBooking() {
            return this.booking !== null;
        },
        alreadyReviewed() {
            return this.hasReview || !this.booking; 
        },
        oneColumn() {
            return !this.loading && this.alreadyReviewed;
        },
        twoColumns() {
            return this.loading || !this.alreadyReviewed;
        }
    },
    methods : {
        async submit() {
            this.sending = true;
            this.errors = null;
            this.success = false;
            this.error = false;
            
            try {
                this.success = (await axios.post(`/api/reviews`, this.review)).status == 201;
            } catch(error) {
                const errors = error.response.data.errors;

                if (errors["content"] && _.size(errors) == 1) { //_loadash _.size
                    this.errors = errors;
                    return;
                }
                this.error = true;
            } finally {
                this.sending = false;
            }
        }
    }
}
</script>