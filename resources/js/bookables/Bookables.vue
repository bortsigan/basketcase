<template>
  <div>
    <!--<bookable-list-item :item-title="bookable1.title" :item-content="bookable1.content" v-bind:item-price="bookable1.price"></bookable-list-item>
        <bookable-list-item :item-title="bookable2.title" :item-content="bookable2.content" :item-price="bookable2.price"></bookable-list-item>
        <bookable-list-item item-title="Hilton Hotel" item-content="Plaza Villa" :item-price="5390"></bookable-list-item> 
        {{ testString }}
        
        !-->
    <div class="d-flex justify-content-between mb-2">
      <span></span>
      <span>
        <div class="form-row align-items-center">
          <div class="col-auto">
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Search any hotels"
                :value="search"
                @keyup="searchBookables($event)"
              />
              <div class="input-group-prepend">
                <button type="button" class="input-group-text btn btn-primary">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </span>
    </div>
    <!-- search !-->
    <div class="row mb-2">
      <div class="col-md-6">
        <a
          @click="getBookables(pages.prev)"
          class="btn btn-primary btn-sm"
          :class="[!pages.prev ? 'd-none' : '']"
          ><i class="fas fa-angle-double-left"></i> Prev</a
        >
      </div>
      <div class="col-md-6">
        <a
          @click="getBookables(pages.next)"
          class="btn btn-primary btn-sm float-right"
          :class="[!pages.next ? 'd-none' : '']"
          >Next <i class="fas fa-angle-double-right"></i
        ></a>
      </div>
    </div>
    
    <!-- list !-->
    <preloader v-if="loading"/>
    <div class="row mb-4" v-for="row in rows" :key="'row' + row" v-else>
      <!-- if no key reference, use (key, value) as replacement !-->
      <div
        class="col"
        v-for="(bookable, column) in bookablesInRow(row)"
        :key="'row' + row + column"
      >
        <!--<bookable-list-item
                    :title="bookable.title"
                    :description="bookable.description"
                    :price="bookable.price"
                />!-->

        <!-- same prop object names on the bookable list item !-->
        <bookable-list-item v-bind="bookable" />
      </div>

      <div
        class="col"
        v-for="p in placeholdersInRow(row)"
        :key="'placeholder' + row + p"
      ></div>
    </div>

    <div class="row mb-2">
      <div class="col-md-6">
        <a
          @click="getBookables(pages.prev)"
          class="btn btn-primary btn-sm"
          :class="[!pages.prev ? 'd-none' : '']"
          ><i class="fas fa-angle-double-left"></i> Prev</a
        >
      </div>
      <div class="col-md-6">
        <a
          @click="getBookables(pages.next)"
          class="btn btn-primary btn-sm float-right"
          :class="[!pages.next ? 'd-none' : '']"
          >Next <i class="fas fa-angle-double-right"></i
        ></a>
      </div>
    </div>

    <!-- <bookable-list-item
            :item-title="bookable.title"
            :item-content="bookable.content"
            :item-price="bookable.price"
            v-for="(bookable, index) in bookables"
            :key="index"
        /> -->
  </div>
</template>

<script>
import BookableListItem from "./BookableListItem";
import { ref, reactive, html } from "vue";

export default {
  components: { BookableListItem },
  data() {
    return {
      bookables: [],
      loading: false,
      columns: 3,
      search: "",
      pages: {
        prev: null,
        next: null,
      },
      isLoading: false
    };
  },
  computed: {
    rows() {
      /* rows are the reference of your preferred rows on the display */
      return this.bookables.length === 0
        ? 0
        : Math.ceil(this.bookables.length / this.columns);
    },
  },
  methods: {
    /** functions that can be used anywhere inside the template **/
    /** explicitly called in the template */
    bookablesInRow(row) {
      return this.bookables.slice((row - 1) * this.columns, row * this.columns);
    },
    placeholdersInRow(row) {
      return this.columns - this.bookablesInRow(row).length;
    },
    async getBookables(url) {
      this.loading = true;
      url = !url ? `/api/bookables` : url;

      return await axios
        .get(`${url}`)
        .then((response) => {
          let { links } = response.data;

          this.bookables = response.data.data;
          this.pages.prev = links.prev
            ? links.prev && this.search
              ? `${links.prev}&search=${this.search}`
              : links.prev
            : "";
          this.pages.next = links.next
            ? links.next && this.search
              ? `${links.next}&search=${this.search}`
              : links.next
            : "";
        })
        .catch((error) => {
          alert("Something went wrong in getting bookables data.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchBookables(event) {
      this.search = event.target.value;
      let url = `/api/bookables?search=${this.search}`;
      this.getBookables(url);
    },
  },
  mounted() {
    /* life cycle methods */
    this.getBookables();
  },
};
</script>
