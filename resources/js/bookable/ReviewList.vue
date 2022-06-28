<template>
  <div class="mt-5 d-none d-md-block">
    <div v-if="loading" class="text-center">Fetching reviews...</div>
    <div v-if="!loading">
      <h6 class="text-secondary"><strong>Review List</strong></h6>
      <div class="border-bottom mt-3" v-for="(review, index) in reviews" :key="index">
        <!-- use index for key instead of review !-->
        <!-- <div class="border-bottom mt-3" v-for="number in 5" :key="number"> random for loop !-->
        <div class="row">
          <div class="col-md-6">Anonymous</div>
          <div class="col-md-6 d-flex justify-content-end">
            <!-- <span v-for="number in review.rating" :key="number"><i class="bi bi-star-fill"></i> </span> -->
            <star-rating :value="review.rating" class="fa-lg"></star-rating>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 text-secondary">
            <span>{{ review.created_at | fromNow }}</span>
          </div>
        </div>

        <div class="row mt-4 mt-4">
          <div class="col-md-12">{{ review.content }}</div>
        </div>
      </div>
      <div class="row mt-4 mt-4">
        <div class="col-md-6">
          <a
            @click="getReviews(pages.prev)"
            class="btn btn-primary btn-sm"
            :class="[!pages.prev ? 'd-none' : '']"
            ><i class="fas fa-angle-double-left"></i> Prev</a
          >
        </div>
        <div class="col-md-6">
          <a
            @click="getReviews(pages.next)"
            class="btn btn-primary btn-sm float-right"
            :class="[!pages.next ? 'd-none' : '']"
            >Next <i class="fas fa-angle-double-right"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
// import StarRating from "../shared/components/StarRating";

export default {
  /** 
    components: {
        StarRating
    },
    **/
  props: {
    bookableId: [String, Number],
  },
  data() {
    return {
      reviews: null,
      loading: false,
      pages: {
        prev: null,
        next: null,
      },
    };
  },
  filters: {
    fromNow(value) {
      return moment(value).fromNow();
    },
  },
  methods: {
    async getReviews(url) {
      this.loading = true;
      url = !url ? `/api/bookables/${this.bookableId}/reviews` : url;

      return await axios
        .get(url)
        .then((response) => {
          let { links } = response.data;

          this.reviews = response.data.data;
          this.pages.prev = links.prev;
          this.pages.next = links.next;
        })
        .catch((error) => {
          alert("Something went wrong, please try again later.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getReviews(`/api/bookables/${this.bookableId}/reviews`);
  },
};
</script>
